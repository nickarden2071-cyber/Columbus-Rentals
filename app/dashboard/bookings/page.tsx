import Link from 'next/link'
import { PlusCircle, MoreHorizontal, CalendarDays, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { cancelBooking } from './actions'

export default async function BookingsPage() {
  const supabase = await createClient()
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, equipment(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bookings</h1>
          <p className="text-slate-500">View and manage customer rentals.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md" asChild>
            <Link href="/dashboard/bookings/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Booking
            </Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-none overflow-hidden">
        <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="bg-slate-50/50">
                    <tr className="border-b border-slate-100 transition-colors hover:bg-transparent">
                        <th className="h-12 px-6 text-left align-middle font-semibold text-slate-900">Customer</th>
                        <th className="h-12 px-6 text-left align-middle font-semibold text-slate-900">Equipment</th>
                        <th className="h-12 px-6 text-left align-middle font-semibold text-slate-900">Dates</th>
                        <th className="h-12 px-6 text-left align-middle font-semibold text-slate-900">Status</th>
                        <th className="h-12 px-6 text-right align-middle font-semibold text-slate-900">Actions</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {bookings?.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                            <td className="p-6 align-middle">
                                <div className="font-semibold text-slate-900">{booking.customer_name}</div>
                                <div className="text-xs text-slate-500">{booking.customer_email}</div>
                            </td>
                            <td className="p-6 align-middle">
                                <div className="font-semibold text-slate-900">{booking.equipment?.name || 'Unknown Item'}</div>
                                <div className="mt-1">
                                    <span className="inline-flex items-center justify-center bg-slate-100 rounded-md px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                        QTY: {booking.quantity}
                                    </span>
                                </div>
                            </td>
                            <td className="p-6 align-middle">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-900">
                                        {format(new Date(booking.start_date), 'MMM dd')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                                    </span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                                        {Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))} Days
                                    </span>
                                </div>
                            </td>
                            <td className="p-6 align-middle">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                    booking.status === 'active' ? 'border-indigo-100 bg-indigo-50 text-indigo-700' :
                                    booking.status === 'completed' ? 'border-green-100 bg-green-50 text-green-700' :
                                    'border-red-100 bg-red-50 text-red-700'
                                }`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </td>
                            <td className="p-6 align-middle text-right">
                                {booking.status === 'active' && (
                                     <form action={cancelBooking.bind(null, booking.id)}>
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </form>
                                )}
                            </td>
                        </tr>
                    ))}
                    {bookings?.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-24 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <CalendarDays className="h-12 w-12 text-slate-200 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-900">No Bookings Found</h3>
                                    <p className="text-slate-500 mt-1 mb-6">Start by creating your first rental booking.</p>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                                        <Link href="/dashboard/bookings/new">New Booking</Link>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}
