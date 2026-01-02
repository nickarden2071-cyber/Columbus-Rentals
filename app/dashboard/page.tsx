import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { Activity, Archive, CalendarDays, Clock, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Parallel data fetching
  const [
    { count: activeBookings },
    { count: totalEquipment },
    { count: maintenanceEquipment },
    { data: upcomingReturns }
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('equipment').select('*', { count: 'exact', head: true }),
    supabase.from('equipment').select('*', { count: 'exact', head: true }).eq('status', 'maintenance'),
    supabase.from('bookings')
        .select('*, equipment(name)')
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('end_date', { ascending: true })
        .limit(5)
  ])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back. Here is what is happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">
              Active Rentals
            </CardTitle>
            <Activity className="h-4 w-4 text-indigo-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeBookings || 0}</div>
            <p className="text-xs text-indigo-100 mt-1">
              Currently out with customers
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Inventory
            </CardTitle>
            <Archive className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalEquipment || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              Items registered in system
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              In Maintenance
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{maintenanceEquipment || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              Unavailable for rental
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-md bg-white">
          <CardHeader className="flex items-center justify-between">
            <div>
                <CardTitle>Upcoming Returns</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Equipment due back in the next few days.</p>
            </div>
            <CalendarDays className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingReturns?.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {booking.equipment?.name?.charAt(0)}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-900">{booking.equipment?.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                {booking.customer_name}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-indigo-600">
                            {new Date(booking.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Due Date</p>
                    </div>
                  </div>
              ))}
               {upcomingReturns?.length === 0 && (
                  <div className="text-center py-12">
                      <CalendarDays className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-sm text-slate-500">No upcoming returns found.</p>
                  </div>
              )}
            </div>
            <div className="mt-8">
                <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" asChild>
                    <Link href="/dashboard/bookings">View All Bookings</Link>
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-md bg-white">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Frequently used tasks.</p>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Button className="w-full justify-start gap-3 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-sm" asChild>
                    <Link href="/dashboard/bookings/new">
                        <PlusCircle className="h-5 w-5" />
                        Create New Booking
                    </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 border-slate-200 hover:bg-slate-50" asChild>
                    <Link href="/dashboard/inventory/new">
                        <Archive className="h-5 w-5 text-slate-500" />
                        Add New Equipment
                    </Link>
                </Button>
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="flex gap-3">
                        <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-amber-900">System Tip</p>
                            <p className="text-xs text-amber-800 leading-relaxed">
                                Remember to check items into maintenance as soon as they return to ensure quality.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
