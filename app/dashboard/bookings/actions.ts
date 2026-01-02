'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { checkAvailability } from '@/services/availability'
import { sendNotification } from '@/services/notifications'

const bookingSchema = z.object({
  equipment_id: z.string().min(1, 'Equipment is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email().optional().or(z.literal('')),
  customer_phone: z.string().optional(),
  notes: z.string().optional(),
})

export async function createBooking(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const validatedFields = bookingSchema.safeParse({
    equipment_id: formData.get('equipment_id'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    quantity: formData.get('quantity'),
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email') || undefined,
    customer_phone: formData.get('customer_phone') || undefined,
    notes: formData.get('notes') || undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  
  const { start_date, end_date, equipment_id, quantity } = validatedFields.data
  
  // Validate dates
  if (new Date(end_date) < new Date(start_date)) {
      return { message: "End date must be after start date" }
  }

  // Check Availability
  const availability = await checkAvailability(
      supabase, 
      equipment_id, 
      new Date(start_date), 
      new Date(end_date), 
      quantity
  )

  if (!availability.available) {
      return { message: availability.reason || 'Equipment not available for selected dates' }
  }

  const { error } = await supabase.from('bookings').insert({
    equipment_id: validatedFields.data.equipment_id,
    start_date: validatedFields.data.start_date,
    end_date: validatedFields.data.end_date,
    quantity: validatedFields.data.quantity,
    customer_name: validatedFields.data.customer_name,
    customer_email: validatedFields.data.customer_email || null,
    customer_phone: validatedFields.data.customer_phone || null,
    notes: validatedFields.data.notes || null,
    status: 'active'
  })

  if (error) {
    console.error(error)
    return {
      message: 'Database Error: Failed to Create Booking.',
    }
  }

  // Send Notification (Fire and forget)
  sendNotification('BOOKING_CREATED', {
      customer: validatedFields.data.customer_name,
      equipment_id: validatedFields.data.equipment_id,
      dates: `${validatedFields.data.start_date} to ${validatedFields.data.end_date}`
  }).catch(console.error)

  revalidatePath('/dashboard/bookings')
  redirect('/dashboard/bookings')
}

export async function cancelBooking(id: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)
    
    if (error) {
        console.error(error)
        // return { message: "Failed to cancel booking."} 
        throw new Error("Failed to cancel booking")
    }

    revalidatePath('/dashboard/bookings')
}
