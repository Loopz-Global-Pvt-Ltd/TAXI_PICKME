'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, FileText, MapPin, Calendar, Car } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const referenceNumber = searchParams.get('ref');
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    // Load confirmed booking details
    const data = localStorage.getItem('demoConfirmedBooking');
    if (data) {
      setBookingDetails(JSON.parse(data));
    }
  }, []);

  if (!referenceNumber) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No booking reference found</p>
            <Link href="/booking">
              <Button>Make a Booking</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-8">
                Your taxi has been successfully booked. We'll send you updates via SMS.
              </p>
              <div className="bg-primary/10 rounded-lg p-6 mb-8">
                <div className="text-sm text-muted-foreground mb-2">Your Booking Reference</div>
                <div className="text-3xl font-bold text-primary">{referenceNumber}</div>
              </div>
            </div>

            {bookingDetails && (
              <div className="bg-muted/50 rounded-lg p-6 mb-8 space-y-4 text-left">
                <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
                <div className="flex gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-muted-foreground">From</div>
                    <div className="font-medium">{bookingDetails.pickupLocation}</div>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <div className="text-muted-foreground">To</div>
                    <div className="font-medium">{bookingDetails.dropoffLocation}</div>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <Car className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-muted-foreground">Vehicle</div>
                    <div className="font-medium">{bookingDetails.selectedVehicle.name}</div>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-muted-foreground">Pickup Time</div>
                    <div className="font-medium">
                      {new Date(bookingDetails.pickupDatetime).toLocaleString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link href="/bookings">
                <Button size="lg" className="w-full">
                  <FileText className="mr-2 h-5 w-5" />
                  View My Bookings
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}