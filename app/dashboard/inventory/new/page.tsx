import { createClient } from '@/utils/supabase/server'
import EquipmentForm from '../form'

export default async function NewEquipmentPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="max-w-2xl mx-auto w-full">
      <EquipmentForm categories={categories || []} />
    </div>
  )
}
