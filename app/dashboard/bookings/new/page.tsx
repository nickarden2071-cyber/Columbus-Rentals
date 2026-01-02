import BookingForm from './form'
import { createClient } from '@/utils/supabase/server'

export default async function NewBookingPage() {
  const supabase = await createClient()
  
  const { data: equipment } = await supabase
    .from('equipment')
    .select('id, name, total_quantity')
    .eq('status', 'available')
    .order('name')

  return (
    <div className="max-w-2xl mx-auto w-full">
      <BookingForm equipmentList={equipment || []} />
    </div>
  )
}
