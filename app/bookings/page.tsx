'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime } from '@/lib/helpers';
import { MapPin, Calendar, Car, CreditCard, User, Phone } from 'lucide-react';

// Dummy Sri Lankan booking data
const DUMMY_BOOKINGS = [
  {
    id: '1',
    reference_number: 'SL-TAX-2024-001',
    booking_status: 'completed',
    pickup_location: 'Bandaranaike International Airport (CMB), Katunayake',
    dropoff_location: 'Galle Face Hotel, Colombo 03',
    pickup_datetime: '2024-10-20T14:30:00',
    vehicle_category: {
      name: 'Toyota Prius (Hybrid)',
      type: 'sedan'
    },
    payment_method: 'card',
    payment_status: 'paid',
    total_fare: 3500,
    distance_km: 35,
    customer_name: 'Nimal Perera',
    customer_phone: '+94 77 123 4567'
  },
  {
    id: '2',
    reference_number: 'SL-TAX-2024-002',
    booking_status: 'in_progress',
    pickup_location: 'Kandy City Centre',
    dropoff_location: 'Temple of the Tooth, Kandy',
    pickup_datetime: '2024-10-26T09:00:00',
    vehicle_category: {
      name: 'Suzuki Wagon R',
      type: 'mini'
    },
    payment_method: 'cash',
    payment_status: 'pending',
    total_fare: 500,
    distance_km: 3,
    customer_name: 'Saman Silva',
    customer_phone: '+94 71 987 6543'
  },
  {
    id: '3',
    reference_number: 'SL-TAX-2024-003',
    booking_status: 'assigned',
    pickup_location: 'Mount Lavinia Beach Hotel',
    dropoff_location: 'National Museum, Colombo 07',
    pickup_datetime: '2024-10-27T11:00:00',
    vehicle_category: {
      name: 'Toyota KDH Van (9 Seater)',
      type: 'van'
    },
    payment_method: 'card',
    payment_status: 'pending',
    total_fare: 2800,
    distance_km: 18,
    customer_name: 'Kumari Fernando',
    customer_phone: '+94 76 555 8888'
  },
  {
    id: '4',
    reference_number: 'SL-TAX-2024-004',
    booking_status: 'new',
    pickup_location: 'Galle Fort Main Gate',
    dropoff_location: 'Unawatuna Beach',
    pickup_datetime: '2024-10-28T15:30:00',
    vehicle_category: {
      name: 'Toyota Axio (Premium)',
      type: 'sedan'
    },
    payment_method: 'cash',
    payment_status: 'pending',
    total_fare: 1200,
    distance_km: 6,
    customer_name: 'Rajitha Bandara',
    customer_phone: '+94 75 222 3333'
  },
  {
    id: '5',
    reference_number: 'SL-TAX-2024-005',
    booking_status: 'cancelled',
    pickup_location: 'Negombo Beach',
    dropoff_location: 'Bandaranaike International Airport (CMB)',
    pickup_datetime: '2024-10-25T06:00:00',
    vehicle_category: {
      name: 'Honda Vezel (SUV)',
      type: 'suv'
    },
    payment_method: 'card',
    payment_status: 'refunded',
    total_fare: 2500,
    distance_km: 12,
    customer_name: 'Chandana Jayasinghe',
    customer_phone: '+94 70 444 5555'
  },
  {
    id: '6',
    reference_number: 'SL-TAX-2024-006',
    booking_status: 'completed',
    pickup_location: 'Nuwara Eliya Grand Hotel',
    dropoff_location: 'Gregory Lake, Nuwara Eliya',
    pickup_datetime: '2024-10-24T08:30:00',
    vehicle_category: {
      name: 'Mitsubishi Montero (4WD)',
      type: 'suv'
    },
    payment_method: 'cash',
    payment_status: 'paid',
    total_fare: 1800,
    distance_km: 8,
    customer_name: 'Amila Wijesinghe',
    customer_phone: '+94 72 666 7777'
  },
  {
    id: '7',
    reference_number: 'SL-TAX-2024-007',
    booking_status: 'new',
    pickup_location: 'Colombo Fort Railway Station',
    dropoff_location: 'Dehiwala Zoo',
    pickup_datetime: '2024-10-29T10:00:00',
    vehicle_category: {
      name: 'Nissan Caravan (Mini Bus)',
      type: 'van'
    },
    payment_method: 'card',
    payment_status: 'pending',
    total_fare: 1500,
    distance_km: 12,
    customer_name: 'Priyanka Mendis',
    customer_phone: '+94 78 888 9999'
  }
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'border-green-500 text-green-700 dark:text-green-400';
      case 'pending':
        return 'border-orange-500 text-orange-700 dark:text-orange-400';
      case 'refunded':
        return 'border-blue-500 text-blue-700 dark:text-blue-400';
      default:
        return 'border-gray-500 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-foreground">My Bookings</h1>
            <p className="text-muted-foreground">View and track your taxi bookings across Sri Lanka</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Bookings</div>
                <div className="text-2xl font-bold text-primary">{bookings.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {bookings.filter(b => b.booking_status === 'completed').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-900">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">In Progress</div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                  {bookings.filter(b => b.booking_status === 'in_progress').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Upcoming</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {bookings.filter(b => b.booking_status === 'new' || b.booking_status === 'assigned').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No Bookings Yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't made any bookings. Start your journey across Sri Lanka today!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Booking Reference
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {booking.reference_number}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <span>{booking.customer_name}</span>
                          <Phone className="h-3.5 w-3.5 ml-2" />
                          <span>{booking.customer_phone}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.booking_status)}>
                        {booking.booking_status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    {/* Location and Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Locations */}
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg h-fit">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-1">Pickup Location</div>
                            <div className="font-medium text-sm">{booking.pickup_location}</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="bg-secondary/10 p-2 rounded-lg h-fit">
                            <MapPin className="h-5 w-5 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-1">Drop-off Location</div>
                            <div className="font-medium text-sm">{booking.dropoff_location}</div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="bg-accent/10 p-2 rounded-lg h-fit">
                            <Calendar className="h-5 w-5 text-accent" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-1">Pickup Date & Time</div>
                            <div className="font-medium text-sm">
                              {formatDateTime(booking.pickup_datetime)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg h-fit">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-1">Vehicle</div>
                            <div className="font-medium text-sm">{booking.vehicle_category?.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Distance: {booking.distance_km} km
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-4 border-t gap-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground capitalize">
                            {booking.payment_method}
                          </span>
                        </div>
                        <Badge variant="outline" className={getPaymentStatusColor(booking.payment_status)}>
                          {booking.payment_status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Total Fare:</span>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(booking.total_fare)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}