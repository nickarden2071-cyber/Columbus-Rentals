import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { deleteEquipment } from './actions'

export default async function InventoryPage() {
  const supabase = await createClient()
  
  const { data: equipment, error } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching inventory:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory</h1>
          <p className="text-slate-500">Manage and track your equipment stock.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md" asChild>
            <Link href="/dashboard/inventory/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Equipment
            </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {equipment?.map((item) => (
          <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group bg-white">
            <div className={`h-2 w-full ${item.status === 'maintenance' ? 'bg-amber-400' : 'bg-green-500'}`} />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {item.name}
                </CardTitle>
              </div>
              <div className="flex gap-2 mt-1">
                {item.status === 'maintenance' ? (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-100">
                    Maintenance
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-100">
                    Available
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{item.total_quantity}</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Units</span>
              </div>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[40px]">
                {item.description || 'No description provided.'}
              </p>
              <div className="mt-6 flex gap-2">
                 <Button variant="outline" size="sm" className="flex-1 border-slate-200 hover:bg-slate-50 hover:text-indigo-600" asChild>
                    <Link href={`/dashboard/inventory/${item.id}`}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                    </Link>
                 </Button>
                 
                 <form action={deleteEquipment.bind(null, item.id)} className="shrink-0">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600 hover:bg-red-50 px-2">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                 </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {equipment?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <Archive className="h-12 w-12 text-slate-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">No Equipment Found</h3>
                <p className="text-slate-500 mt-1 mb-6">Start by adding your first rental item.</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                    <Link href="/dashboard/inventory/new">Add Equipment</Link>
                </Button>
            </div>
        )}
      </div>
    </div>
  )
}
