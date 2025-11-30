"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Loader2,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Car,
  Navigation,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

interface Booking {
  id: number
  booking_reference: string
  vehicle_id: number
  vehicle_name: string
  vehicle_category: string
  vehicle_image: string
  full_name: string
  email: string
  phone: string
  pickup_location: string
  dropoff_location: string
  pickup_date: string
  pickup_time: string
  number_of_days: number
  estimated_distance_km: number
  base_price: number
  distance_price: number
  total_price: number
  status: string
  payment_status: string
  payment_method: string
  special_requests: string
  created_at: string
}

export default function BookingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAdmin()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [pagination, setPagination] = useState({ limit: 20, offset: 0, total: 0 })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/taxipickme-admin')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings()
    }
  }, [isAuthenticated, filterStatus, filterPayment, pagination.offset])

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      })

      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }

      if (filterPayment !== 'all') {
        params.append('paymentStatus', filterPayment)
      }

      const response = await fetch(`/api/admin/bookings?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setBookings(data.data)
        setPagination(prev => ({ ...prev, total: data.total }))
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoadingBookings(false)
    }
  }

  const handleStatusUpdate = async (bookingId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchBookings()
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status })
        }
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    }
  }

  const handlePaymentStatusUpdate = async (bookingId: number, paymentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchBookings()
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, payment_status: paymentStatus })
        }
      } else {
        alert('Failed to update payment status')
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Error updating payment status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'unpaid':
        return 'bg-orange-100 text-orange-800'
      case 'refunded':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading || isLoadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/taxipickme-admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-yellow-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                  <p className="text-sm text-gray-600">{pagination.total} total bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  className={filterStatus === status ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
            <div className="flex gap-2">
              {['all', 'unpaid', 'paid', 'refunded'].map((payment) => (
                <Button
                  key={payment}
                  onClick={() => setFilterPayment(payment)}
                  variant={filterPayment === payment ? 'default' : 'outline'}
                  size="sm"
                  className={filterPayment === payment ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                >
                  {payment.charAt(0).toUpperCase() + payment.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">There are no bookings matching your filters</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Ref
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pickup Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.booking_reference}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.full_name}</div>
                          <div className="text-xs text-gray-500">{booking.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.vehicle_name}</div>
                          <div className="text-xs text-gray-500 capitalize">{booking.vehicle_category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.pickup_date}</div>
                          <div className="text-xs text-gray-500">{booking.pickup_time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            LKR {booking.total_price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.number_of_days} day{booking.number_of_days > 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPaymentStatusColor(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            onClick={() => setSelectedBooking(booking)}
                            variant="outline"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} bookings
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                  disabled={pagination.offset === 0}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                  variant="outline"
                  size="sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <p className="text-sm text-gray-600">{selectedBooking.booking_reference}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Booking Status
                  </label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleStatusUpdate(selectedBooking.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={selectedBooking.payment_status}
                    onChange={(e) => handlePaymentStatusUpdate(selectedBooking.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Trip Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Pickup Location</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.pickup_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Dropoff Location</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.dropoff_location}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Pickup Date</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.pickup_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Pickup Time</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.pickup_time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Estimated Distance</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.estimated_distance_km} km</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedBooking.vehicle_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{selectedBooking.vehicle_category}</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price ({selectedBooking.number_of_days} days)</span>
                    <span className="font-medium">LKR {selectedBooking.base_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distance Price ({selectedBooking.estimated_distance_km} km)</span>
                    <span className="font-medium">LKR {selectedBooking.distance_price.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="font-bold text-lg text-gray-900">LKR {selectedBooking.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.special_requests && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Requests</h3>
                  <p className="text-sm text-gray-700">{selectedBooking.special_requests}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
              <Button
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
