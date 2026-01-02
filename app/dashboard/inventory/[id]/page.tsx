import EquipmentForm from '../form'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEquipmentPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: equipment },
    { data: categories }
  ] = await Promise.all([
    supabase.from('equipment').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name')
  ])

  if (!equipment) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <EquipmentForm equipment={equipment} categories={categories || []} />
    </div>
  )
}
