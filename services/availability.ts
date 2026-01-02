import { SupabaseClient } from '@supabase/supabase-js';
import { addDays, subDays, isBefore, isAfter, parseISO, format, isWithinInterval } from 'date-fns';

const DEFAULT_BUFFER = 1;

export async function getBufferDays(supabase: SupabaseClient): Promise<number> {
  const { data } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'buffer_days')
    .single();
    
  // value is jsonb, likely a string or number
  if (data?.value) {
    const val = Number(data.value);
    return isNaN(val) ? DEFAULT_BUFFER : val;
  }
  return DEFAULT_BUFFER;
}

export async function checkAvailability(
  supabase: SupabaseClient,
  equipmentId: string,
  startDate: Date,
  endDate: Date,
  quantityRequested: number
): Promise<{ available: boolean; reason?: string; maxAvailable?: number }> {
  
  // 1. Get Equipment Details
  const { data: equipment, error: eqError } = await supabase
    .from('equipment')
    .select('total_quantity, status, name')
    .eq('id', equipmentId)
    .single();

  if (eqError || !equipment) {
    return { available: false, reason: 'Equipment not found' };
  }

  if (equipment.status === 'maintenance') {
    return { available: false, reason: `Item '${equipment.name}' is currently in maintenance.` };
  }

  if (quantityRequested > equipment.total_quantity) {
     return { available: false, reason: `Requested quantity (${quantityRequested}) exceeds total stock (${equipment.total_quantity}).` };
  }

  // 2. Get Buffer
  const bufferDays = await getBufferDays(supabase);

  // 3. Fetch Overlapping Bookings
  // We need bookings that *could* block any day in [startDate, endDate].
  // A booking B blocks [B.start - buffer, B.end + buffer].
  // So we need bookings where [B.start - buffer, B.end + buffer] overlaps [startDate, endDate].
  // Logic: (B.start - buffer) <= endDate AND (B.end + buffer) >= startDate
  // Transformed for query: B.start <= endDate + buffer AND B.end >= startDate - buffer
  
  const searchStart = subDays(startDate, bufferDays);
  const searchEnd = addDays(endDate, bufferDays);
  
  // Format for DB query (YYYY-MM-DD)
  const searchStartStr = format(searchStart, 'yyyy-MM-dd');
  const searchEndStr = format(searchEnd, 'yyyy-MM-dd');

  const { data: bookings, error: bkError } = await supabase
    .from('bookings')
    .select('start_date, end_date, quantity')
    .eq('equipment_id', equipmentId)
    .neq('status', 'cancelled')
    .lte('start_date', searchEndStr)
    .gte('end_date', searchStartStr);

  if (bkError) {
    console.error('Error fetching bookings:', bkError);
    return { available: false, reason: 'System error checking availability' };
  }

  // 4. Check daily availability
  // Iterate through each day of the requested period
  let currentDay = new Date(startDate);
  const end = new Date(endDate);
  
  // Safety break for infinite loops (e.g. invalid dates)
  let loopCount = 0;
  
  while (currentDay <= end && loopCount < 3650) { // Max 10 years check
    let usedQuantity = 0;
    
    for (const booking of bookings) {
      // Check if this booking blocks 'currentDay'
      // Blocking period: [booking.start - buffer, booking.end + buffer]
      const bStart = parseISO(booking.start_date as unknown as string);
      const bEnd = parseISO(booking.end_date as unknown as string);
      
      const blockedStart = subDays(bStart, bufferDays);
      const blockedEnd = addDays(bEnd, bufferDays);
      
      if (isWithinInterval(currentDay, { start: blockedStart, end: blockedEnd })) {
        usedQuantity += booking.quantity;
      }
    }
    
    if (usedQuantity + quantityRequested > equipment.total_quantity) {
       const availableOnDay = Math.max(0, equipment.total_quantity - usedQuantity);
       const dayStr = format(currentDay, 'MMM dd, yyyy');
       return { 
         available: false, 
         reason: `Insufficient quantity on ${dayStr}. Available: ${availableOnDay}, Requested: ${quantityRequested} (Buffer days: ${bufferDays})`,
         maxAvailable: availableOnDay
       };
    }

    currentDay = addDays(currentDay, 1);
    loopCount++;
  }

  return { available: true };
}
