"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Car, 
  Calendar, 
  Users, 
  LogOut, 
  Loader2,
  LayoutDashboard
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAdmin()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/taxisrilanka-admin')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    await logout()
    router.push('/taxisrilanka-admin')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-yellow-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.fullName || user?.username}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <Package className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <Car className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bookings Today</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <Users className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="">
              <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:shadow-md transition-all cursor-pointer">
                <Package className="h-8 w-8 text-yellow-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Manage Packages</h3>
                <p className="text-sm text-gray-600">Create and manage taxi packages</p>
              </div>
            </Link>

            <Link href="/taxisrilanka-admin/vehicles">
              <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:shadow-md transition-all cursor-pointer">
                <Car className="h-8 w-8 text-yellow-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Manage Vehicles</h3>
                <p className="text-sm text-gray-600">Add and update vehicle fleet</p>
              </div>
            </Link>

            <Link href="/taxisrilanka-admin/bookings">
              <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:shadow-md transition-all cursor-pointer">
                <Calendar className="h-8 w-8 text-yellow-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">View Bookings</h3>
                <p className="text-sm text-gray-600">Manage all customer bookings</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
