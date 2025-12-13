"use client"

import { useEffect, useState } from 'react'
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
  LayoutDashboard,
  DollarSign,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalPackages: number
  totalVehicles: number
  bookingsToday: number
  activeUsers: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAdmin()
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    totalVehicles: 0,
    bookingsToday: 0,
    activeUsers: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/taxisrilanka-admin')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated) return

      try {
        setStatsLoading(true)
        const response = await fetch('/api/admin/dashboard/stats')
        const data = await response.json()

        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated])

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
          {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Packages</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPackages}</p>
                )}
              </div>
              <Package className="h-10 w-10 text-blue-500" />
            </div>
          </div> */}

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
                )}
              </div>
              <Car className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bookings Today</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats.bookingsToday}</p>
                )}
              </div>
              <Calendar className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                )}
              </div>
              <Users className="h-10 w-10 text-orange-500" />
            </div>
          </div> */}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* <Link href="/taxisrilanka-admin/packages">
              <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:shadow-md transition-all cursor-pointer">
                <Package className="h-8 w-8 text-yellow-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Manage Packages</h3>
                <p className="text-sm text-gray-600">Create and manage taxi packages</p>
              </div>
            </Link> */}

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
            {/* <Link href="/taxisrilanka-admin/pricing">
              <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:shadow-md transition-all cursor-pointer">
                <DollarSign className="h-8 w-8 text-yellow-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Pricing Configuration</h3>
                <p className="text-sm text-gray-600">Configure pricing and rates</p>
              </div>
            </Link> */}
            <Link href="/taxisrilanka-admin/vehicles/pricing">
              <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:shadow-md transition-all cursor-pointer">
                <DollarSign className="h-8 w-8 text-yellow-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Vehicle Pricing</h3>
                <p className="text-sm text-gray-600">Tier Config</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}