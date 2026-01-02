import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function NotificationsPage() {
  // Placeholder data
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'New Booking Created',
      description: 'A new booking for Caterpillar Excavator has been created for Jan 15 - Jan 20.',
      time: '2 hours ago',
      icon: Info,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Maintenance Due',
      description: 'Power Generator #4 is scheduled for maintenance tomorrow.',
      time: '5 hours ago',
      icon: AlertTriangle,
      color: 'text-amber-500'
    },
    {
      id: 3,
      type: 'success',
      title: 'Inventory Updated',
      description: 'Total quantity for "Scaffolding Set" was updated to 15.',
      time: '1 day ago',
      icon: CheckCircle2,
      color: 'text-green-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-slate-500">View recent system activity and alerts.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Placeholders for the notification system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-4 items-start pb-6 border-b last:border-0 last:pb-0">
                <div className={`mt-1 p-2 rounded-full bg-slate-50 ${n.color}`}>
                  <n.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{n.title}</p>
                    <span className="text-xs text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {n.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-md">
        <div className="flex gap-3">
          <Bell className="h-5 w-5 text-blue-600" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-blue-900">V1 Note</h4>
            <p className="text-sm text-blue-800">
              Email and SMS notifications are currently disabled in this lean V1. 
              The system only records internal events for display here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
