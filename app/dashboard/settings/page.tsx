import { createClient } from '@/utils/supabase/server'
import SettingsForm from './settings-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const [
    { data: bufferData },
    { data: categories }
  ] = await Promise.all([
    supabase.from('app_settings').select('value').eq('key', 'buffer_days').single(),
    supabase.from('categories').select('*').order('name', { ascending: true })
  ])

  const initialBuffer = bufferData?.value ? Number(bufferData.value) : 1

  return <SettingsForm initialBuffer={initialBuffer} categories={categories || []} />
}
