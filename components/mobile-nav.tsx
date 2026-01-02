'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Package2, LayoutDashboard, CalendarDays, Archive, Bell, Settings, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { logout } from '@/app/dashboard/actions'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon" onClick={toggle} className="text-slate-500">
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white p-6 animate-in slide-in-from-left duration-300">
          <div className="flex items-center justify-between mb-8">
            <Link className="flex items-center gap-2 font-semibold" href="/dashboard" onClick={toggle}>
              <Package2 className="h-6 w-6" />
              <span>Columbus Rentals</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggle}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="grid gap-4 text-lg font-medium">
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
              href="/dashboard"
              onClick={toggle}
            >
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
              href="/dashboard/inventory"
              onClick={toggle}
            >
              <Archive className="h-5 w-5" />
              Inventory
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
              href="/dashboard/bookings"
              onClick={toggle}
            >
              <CalendarDays className="h-5 w-5" />
              Bookings
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
              href="/dashboard/notifications"
              onClick={toggle}
            >
              <Bell className="h-5 w-5" />
              Notifications
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
              href="/dashboard/settings"
              onClick={toggle}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            
            <div className="mt-8 pt-8 border-t">
              <form action={logout}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 p-0" size="lg">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </Button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
