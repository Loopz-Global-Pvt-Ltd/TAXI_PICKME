'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Calendar, Users, Car, CreditCard, Banknote, Check } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return `LKR ${amount.toLocaleString()}`;
};

const calculateFare = (distance: number, baseFare: number, pricePerKm: number) => {
  return baseFare + (distance * pricePerKm);
};

const formatDateTime = (datetime: string) => {
  const date = new Date(datetime);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const generateReferenceNumber = () => {
  const prefix = 'SL-TAX';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${random}`;
};

export default function ConfirmBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');

  useEffect(() => {
    // Load booking data from localStorage
    const data = localStorage.getItem('demoBookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      router.push('/booking');
    }
  }, []);

  const handleConfirmBooking = async () => {
    if (!bookingData) return;

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const referenceNumber = generateReferenceNumber();
      
      // Store confirmed booking
      const confirmedBooking = {
        ...bookingData,
        specialRequests,
        paymentMethod,
        referenceNumber,
        bookingStatus: 'new',
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('demoConfirmedBooking', JSON.stringify(confirmedBooking));
      router.push(`/booking/success?ref=${referenceNumber}`);
    }, 1500);
  };

  if (!bookingData) {
    return null;
  }

  const { selectedVehicle, distanceKm, pickupLocation, dropoffLocation, pickupDatetime, passengerCount } = bookingData;
  const totalFare = calculateFare(distanceKm, selectedVehicle.base_fare, selectedVehicle.price_per_km);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Confirm Your Booking</h1>
          <p className="text-muted-foreground mb-8">
            Review your trip details and complete your booking
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Trip Summary</h2>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Pickup</div>
                        <div className="font-medium">{pickupLocation}</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="h-5 w-5 text-secondary mt-1" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Drop-off</div>
                        <div className="font-medium">{dropoffLocation}</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Calendar className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Pickup Time</div>
                        <div className="font-medium">{formatDateTime(pickupDatetime)}</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Users className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Passengers</div>
                        <div className="font-medium">{passengerCount}</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Car className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Vehicle</div>
                        <div className="font-medium">
                          {selectedVehicle.name}
                          {selectedVehicle.has_ac && ' (AC)'}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Distance: {distanceKm} km
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="special">Special Requests (Optional)</Label>
                      <Textarea
                        id="special"
                        placeholder="e.g., Child seat required, Extra luggage space, etc."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </h2>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: 'cash' | 'online') => setPaymentMethod(value)}
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-5 w-5" />
                          <div>
                            <div className="font-medium">Cash on Drop-off</div>
                            <div className="text-sm text-muted-foreground">
                              Pay when you reach your destination
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 mt-3">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <div className="font-medium">Online Payment</div>
                            <div className="text-sm text-muted-foreground">
                              Pay now via Card/Bank Transfer (Demo)
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Fare Breakdown</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Base Fare</span>
                      <span>{formatCurrency(selectedVehicle.base_fare)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Distance ({distanceKm} km)</span>
                      <span>
                        {formatCurrency(distanceKm * selectedVehicle.price_per_km)}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-semibold">Total Fare</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(totalFare)}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handleConfirmBooking}
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        'Processing...'
                      ) : (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={loading}
                      className="w-full"
                    >
                      Go Back
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}