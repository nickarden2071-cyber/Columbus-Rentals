'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { createEquipment, updateEquipment } from './actions'

// Reusable form component
export default function EquipmentForm({ equipment, categories = [] }: { equipment?: any, categories?: any[] }) {
  const router = useRouter()
  // If equipment exists, we are updating. Otherwise creating.
  const updateAction = equipment ? updateEquipment.bind(null, equipment.id) : createEquipment
  
  const [state, formAction, isPending] = useActionState(updateAction, null)

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>{equipment ? 'Edit Equipment' : 'New Equipment'}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input 
                id="name" 
                name="name" 
                defaultValue={equipment?.name}
                placeholder="e.g. Caterpillar Excavator" 
                required 
            />
             {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="category_id" className="text-sm font-medium">Category</label>
            <select 
                id="category_id" 
                name="category_id" 
                defaultValue={equipment?.category_id || ''}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            >
                <option value="">No Category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            {state?.errors?.category_id && <p className="text-red-500 text-sm">{state.errors.category_id}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="total_quantity" className="text-sm font-medium">Total Quantity</label>
            <Input 
                id="total_quantity" 
                name="total_quantity" 
                type="number" 
                defaultValue={equipment?.total_quantity ?? 1}
                min="0"
                required 
            />
            {state?.errors?.total_quantity && <p className="text-red-500 text-sm">{state.errors.total_quantity}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <select 
                id="status" 
                name="status" 
                defaultValue={equipment?.status || 'available'}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
            </select>
            {state?.errors?.status && <p className="text-red-500 text-sm">{state.errors.status}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea 
                id="description" 
                name="description" 
                defaultValue={equipment?.description || ''}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            />
            {state?.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
          </div>
          
           {state?.message && (
              <p className="text-sm font-medium text-red-500">{state.message}</p>
            )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="ghost" 
            type="button" 
            onClick={() => router.push('/dashboard/inventory')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Equipment'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
