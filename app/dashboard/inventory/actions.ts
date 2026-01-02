'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const equipmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category_id: z.string().optional(),
  total_quantity: z.coerce.number().min(0, 'Quantity cannot be negative'),
  status: z.enum(['available', 'maintenance']),
  description: z.string().optional(),
})

export async function createEquipment(prevState: any, formData: FormData) {
  const supabase = await createClient()

  console.log("Creating equipment...")
  const rawFormData = {
    name: formData.get('name'),
    category_id: formData.get('category_id'),
    total_quantity: formData.get('total_quantity'),
    status: formData.get('status'),
    description: formData.get('description'),
  }
  console.log("Form Data:", rawFormData)

  const validatedFields = equipmentSchema.safeParse({
    ...rawFormData,
    category_id: rawFormData.category_id || undefined,
  })

  if (!validatedFields.success) {
    console.error("Validation Error:", validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { error } = await supabase.from('equipment').insert({
    name: validatedFields.data.name,
    category_id: validatedFields.data.category_id || null,
    total_quantity: validatedFields.data.total_quantity,
    status: validatedFields.data.status,
    description: validatedFields.data.description,
  })

  if (error) {
    console.error("Supabase Error:", error)
    return {
      message: 'Database Error: Failed to Create Equipment. ' + error.message,
    }
  }
  
  console.log("Equipment created successfully")

  revalidatePath('/dashboard/inventory')
  redirect('/dashboard/inventory')
}

export async function updateEquipment(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient()
  
    const rawFormData = {
      name: formData.get('name'),
      category_id: formData.get('category_id'),
      total_quantity: formData.get('total_quantity'),
      status: formData.get('status'),
      description: formData.get('description'),
    }

    const validatedFields = equipmentSchema.safeParse({
      ...rawFormData,
      category_id: rawFormData.category_id || undefined,
    })
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }
  
    const { error } = await supabase
      .from('equipment')
      .update({
        name: validatedFields.data.name,
        category_id: validatedFields.data.category_id || null,
        total_quantity: validatedFields.data.total_quantity,
        status: validatedFields.data.status,
        description: validatedFields.data.description,
      })
      .eq('id', id)
  
    if (error) {
      return {
        message: 'Database Error: Failed to Update Equipment.',
      }
    }
  
    revalidatePath('/dashboard/inventory')
    redirect('/dashboard/inventory')
}

export async function deleteEquipment(id: string) {
    const supabase = await createClient()
    
    // Check for existing bookings first?
    // The DB has ON DELETE RESTRICT for bookings -> equipment_id, so it will fail automatically if booked.
    
    const { error } = await supabase.from('equipment').delete().eq('id', id)
    
    if (error) {
        // In a real app we'd return the error to the UI
        console.error("Failed to delete", error)
        // return { message: "Failed to delete equipment. It might have active bookings."}
        throw new Error("Failed to delete equipment. It might have active bookings.")
    }

    revalidatePath('/dashboard/inventory')
}
