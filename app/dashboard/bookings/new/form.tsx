'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { createBooking } from '../actions'

export default function BookingForm({ equipmentList }: { equipmentList: any[] }) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createBooking, null)

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Create Booking</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          
          <div className="grid gap-2">
            <label htmlFor="equipment_id" className="text-sm font-medium">Equipment</label>
            <select 
                id="equipment_id" 
                name="equipment_id" 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                required
            >
                <option value="">Select Equipment</option>
                {equipmentList.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name} (Stock: {item.total_quantity})
                    </option>
                ))}
            </select>
            {state?.errors?.equipment_id && <p className="text-red-500 text-sm">{state.errors.equipment_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <label htmlFor="start_date" className="text-sm font-medium">Start Date</label>
                <Input 
                    id="start_date" 
                    name="start_date" 
                    type="date" 
                    required 
                />
                {state?.errors?.start_date && <p className="text-red-500 text-sm">{state.errors.start_date}</p>}
            </div>
            <div className="grid gap-2">
                <label htmlFor="end_date" className="text-sm font-medium">End Date</label>
                <Input 
                    id="end_date" 
                    name="end_date" 
                    type="date" 
                    required 
                />
                {state?.errors?.end_date && <p className="text-red-500 text-sm">{state.errors.end_date}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
            <Input 
                id="quantity" 
                name="quantity" 
                type="number" 
                defaultValue={1}
                min="1"
                required 
            />
            {state?.errors?.quantity && <p className="text-red-500 text-sm">{state.errors.quantity}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="customer_name" className="text-sm font-medium">Customer Name</label>
            <Input 
                id="customer_name" 
                name="customer_name" 
                placeholder="John Doe" 
                required 
            />
            {state?.errors?.customer_name && <p className="text-red-500 text-sm">{state.errors.customer_name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <label htmlFor="customer_email" className="text-sm font-medium">Email (Optional)</label>
                <Input 
                    id="customer_email" 
                    name="customer_email" 
                    type="email" 
                    placeholder="john@example.com" 
                />
                 {state?.errors?.customer_email && <p className="text-red-500 text-sm">{state.errors.customer_email}</p>}
            </div>
            <div className="grid gap-2">
                <label htmlFor="customer_phone" className="text-sm font-medium">Phone (Optional)</label>
                <Input 
                    id="customer_phone" 
                    name="customer_phone" 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">Notes</label>
            <textarea 
                id="notes" 
                name="notes" 
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            />
          </div>
          
           {state?.message && (
              <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-500">
                {state.message}
              </div>
            )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="ghost" 
            type="button" 
            onClick={() => router.push('/dashboard/bookings')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Checking Availability...' : 'Create Booking'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
