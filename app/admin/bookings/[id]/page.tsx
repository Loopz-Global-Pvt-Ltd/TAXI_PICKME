'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Booking, Driver } from '@/lib/types';
import { formatCurrency, formatDateTime } from '@/lib/helpers';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Car,
  CreditCard,
  User,
  Phone,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadBooking();
    loadDrivers();
  }, [params.id]);

  const loadBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          driver:drivers(*),
          vehicle_category:vehicle_categories(*)
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load booking details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: status, updated_at: new Date().toISOString() })
        .eq('id', params.id);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Booking status changed to ${status}`,
      });
      loadBooking();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignDriver = async (driverId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          driver_id: driverId,
          booking_status: 'assigned',
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (error) throw error;

      toast({
        title: 'Driver Assigned',
        description: 'Driver has been successfully assigned to this booking',
      });
      loadBooking();
    } catch (error) {
      toast({
        title: 'Assignment Failed',
        description: 'Failed to assign driver',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!booking) return;

    const message = `
Taxi Pickme Booking Confirmation

Reference: ${booking.reference_number}
Customer: ${booking.customer?.name}
Phone: ${booking.customer?.phone}

Pickup: ${booking.pickup_location}
Drop-off: ${booking.dropoff_location}
Date & Time: ${formatDateTime(booking.pickup_datetime)}

Vehicle: ${booking.vehicle_category?.name}
Passengers: ${booking.passenger_count}
Distance: ${booking.distance_km} km

Total Fare: ${formatCurrency(booking.total_fare)}
Payment: ${booking.payment_method}

${booking.special_requests ? `Special Requests: ${booking.special_requests}` : ''}
    `.trim();

    navigator.clipboard.writeText(message);
    toast({
      title: 'Copied to Clipboard',
      description: 'Booking details copied successfully',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="text-center">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="text-center">
            <p className="mb-4">Booking not found</p>
            <Link href="/admin">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link href="/admin">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Booking Details</h1>
              <p className="text-muted-foreground">{booking.reference_number}</p>
            </div>
            <Badge className={getStatusColor(booking.booking_status)} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              {booking.booking_status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Pickup Location</div>
                      <div className="font-medium">{booking.pickup_location}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Drop-off Location</div>
                      <div className="font-medium">{booking.dropoff_location}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Pickup Date & Time</div>
                      <div className="font-medium">{formatDateTime(booking.pickup_datetime)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <Users className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">Passengers</div>
                        <div className="font-medium">{booking.passenger_count}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Car className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">Distance</div>
                        <div className="font-medium">{booking.distance_km} km</div>
                      </div>
                    </div>
                  </div>
                  {booking.special_requests && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-muted-foreground mb-1">Special Requests</div>
                      <div className="font-medium">{booking.special_requests}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <User className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Name</div>
                      <div className="font-medium">{booking.customer?.name}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{booking.customer?.phone}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle & Driver</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Vehicle Category</div>
                    <div className="font-medium text-lg">{booking.vehicle_category?.name}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Assign Driver</Label>
                    <Select
                      value={booking.driver_id || ''}
                      onValueChange={handleAssignDriver}
                      disabled={updating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} - {driver.vehicle_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {booking.driver && (
                    <div className="pt-4 border-t">
                      <div className="text-sm font-semibold mb-2">Assigned Driver</div>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-muted-foreground">Name:</span> {booking.driver.name}</div>
                        <div><span className="text-muted-foreground">Phone:</span> {booking.driver.phone}</div>
                        <div><span className="text-muted-foreground">Vehicle:</span> {booking.driver.vehicle_number}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleCopyToClipboard} variant="outline" className="w-full">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Details
                  </Button>
                  <div className="pt-3 border-t">
                    <div className="text-sm font-semibold mb-2">Update Status</div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleUpdateStatus('assigned')}
                        disabled={updating || booking.booking_status === 'assigned'}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Mark as Assigned
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus('in_progress')}
                        disabled={updating || booking.booking_status === 'in_progress'}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Mark In Progress
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus('completed')}
                        disabled={updating || booking.booking_status === 'completed'}
                        className="w-full"
                        size="sm"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Completed
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus('cancelled')}
                        disabled={updating || booking.booking_status === 'cancelled'}
                        variant="destructive"
                        className="w-full"
                        size="sm"
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Base Fare</span>
                      <span>{formatCurrency(booking.base_fare)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Distance ({booking.distance_km} km)</span>
                      <span>
                        {formatCurrency(
                          booking.total_fare - booking.base_fare
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">Total Fare</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(booking.total_fare)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4" />
                        <span className="capitalize">{booking.payment_method}</span>
                        <Badge variant="outline" className="ml-auto">
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
