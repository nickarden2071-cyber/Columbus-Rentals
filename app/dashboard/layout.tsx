import Link from 'next/link'
import { Package2, LayoutDashboard, CalendarDays, Archive, LogOut, Bell, Settings } from 'lucide-react'
import { logout } from './actions'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/mobile-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-slate-100/40 lg:block dark:bg-slate-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
              <Package2 className="h-6 w-6" />
              <span className="">Columbus Rentals</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-indigo-600 hover:bg-indigo-50/50"
                href="/dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-indigo-600 hover:bg-indigo-50/50"
                href="/dashboard/inventory"
              >
                <Archive className="h-4 w-4" />
                Inventory
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-indigo-600 hover:bg-indigo-50/50"
                href="/dashboard/bookings"
              >
                <CalendarDays className="h-4 w-4" />
                Bookings
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-indigo-600 hover:bg-indigo-50/50"
                href="/dashboard/notifications"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-indigo-600 hover:bg-indigo-50/50"
                href="/dashboard/settings"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
             <form action={logout}>
                <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50" size="sm">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
             </form>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10 px-6">
          <MobileNav />
          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  )
}
