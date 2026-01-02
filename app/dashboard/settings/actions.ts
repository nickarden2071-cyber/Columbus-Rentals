'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateBufferDays(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const bufferDays = formData.get('buffer_days')

  if (!bufferDays) {
    return { error: 'Buffer days is required' }
  }

  const { error } = await supabase
    .from('app_settings')
    .upsert({ 
      key: 'buffer_days', 
      value: JSON.stringify(Number(bufferDays)) 
    }, { onConflict: 'key' })

  if (error) {
    console.error('Error updating buffer days:', error)
    return { error: 'Failed to update settings' }
  }

  revalidatePath('/dashboard/settings')
  return { success: 'Settings updated successfully' }
}

export async function createCategory(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  if (!name) return { error: 'Name is required' }

  const slug = name.toLowerCase().replace(/ /g, '-')
  
  const { error } = await supabase
    .from('categories')
    .insert({ name, slug })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: 'Category created' }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/settings')
}
