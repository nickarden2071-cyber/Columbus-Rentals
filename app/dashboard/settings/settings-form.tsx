'use client'

import { useActionState } from 'react'
import { updateBufferDays, createCategory, deleteCategory } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Trash2, Plus } from 'lucide-react'

export default function SettingsPage({ initialBuffer, categories }: { initialBuffer: number, categories: any[] }) {
  const [state, formAction, isPending] = useActionState(updateBufferDays, null)
  const [catState, catFormAction, catIsPending] = useActionState(createCategory, null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500">Manage your application configuration.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rental Configuration</CardTitle>
              <CardDescription>
                Configure how the booking system handles availability and gaps between rentals.
              </CardDescription>
            </CardHeader>
            <form action={formAction}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="buffer_days" className="text-sm font-medium">
                    Buffer Days
                  </label>
                  <div className="flex max-w-[200px] items-center gap-2">
                    <Input
                      id="buffer_days"
                      name="buffer_days"
                      type="number"
                      min="0"
                      max="14"
                      defaultValue={initialBuffer}
                      required
                    />
                    <span className="text-sm text-slate-500 whitespace-nowrap">days</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Number of days required before and after each booking for cleaning/maintenance. 
                  </p>
                </div>

                {state?.error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                    <AlertCircle className="h-4 w-4" />
                    {state.error}
                  </div>
                )}

                {state?.success && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-100">
                    <CheckCircle2 className="h-4 w-4" />
                    {state.success}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Details about your Columbus Rentals instance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 text-sm">
                  <div className="text-slate-500">Version</div>
                  <div className="font-medium text-right">V1.0.0 (Lean Production)</div>
               </div>
               <div className="grid grid-cols-2 text-sm">
                  <div className="text-slate-500">Environment</div>
                  <div className="font-medium text-right text-green-600">Active</div>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Categories</CardTitle>
              <CardDescription>
                Manage categories to organize your inventory.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={catFormAction} className="flex gap-2">
                <Input name="name" placeholder="Category name (e.g. Heavy Machinery)" required />
                <Button type="submit" size="icon" disabled={catIsPending}>
                  <Plus className="h-4 w-4" />
                </Button>
              </form>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-2 border rounded-md bg-white">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <form action={deleteCategory.bind(null, cat.id)}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No categories created yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
