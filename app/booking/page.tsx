'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, ArrowRight, Car } from 'lucide-react';

// Dummy Sri Lankan Vehicle Data
const DUMMY_VEHICLES = [
  {
    id: '1',
    name: 'Toyota Prius (Hybrid)',
    type: 'sedan',
    capacity: 3,
    has_ac: true,
    base_fare: 500,
    price_per_km: 80,
    image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    is_active: true
  },
  {
    id: '2',
    name: 'Suzuki Wagon R',
    type: 'mini',
    capacity: 3,
    has_ac: true,
    base_fare: 300,
    price_per_km: 60,
    image_url: 'https://images.unsplash.com/photo-1583267746897-c2f1830a3303?w=400',
    is_active: true
  },
  {
    id: '3',
    name: 'Toyota KDH Van (9 Seater)',
    type: 'van',
    capacity: 9,
    has_ac: true,
    base_fare: 1500,
    price_per_km: 120,
    image_url: 'https://images.unsplash.com/photo-1527537686-5a8f8e0e8f59?w=400',
    is_active: true
  },
  {
    id: '4',
    name: 'Toyota Axio (Premium)',
    type: 'sedan',
    capacity: 3,
    has_ac: true,
    base_fare: 600,
    price_per_km: 90,
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    is_active: true
  },
  {
    id: '5',
    name: 'Honda Vezel (SUV)',
    type: 'suv',
    capacity: 5,
    has_ac: true,
    base_fare: 800,
    price_per_km: 100,
    image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    is_active: true
  },
  {
    id: '6',
    name: 'Mitsubishi Montero (4WD)',
    type: 'suv',
    capacity: 7,
    has_ac: true,
    base_fare: 1200,
    price_per_km: 150,
    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
    is_active: true
  }
];

const formatCurrency = (amount: number) => {
  return `LKR ${amount.toLocaleString()}`;
};

const calculateFare = (distance: number, baseFare: number, pricePerKm: number) => {
  return baseFare + (distance * pricePerKm);
};

export default function BookingPage() {
  const router = useRouter();
  const [vehicles] = useState(DUMMY_VEHICLES);
  const [loading] = useState(false);
  
  // Booking form state
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [pickupDatetime, setPickupDatetime] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    if (!distanceKm) {
      setDistanceKm(50); // Default distance
    }
  };

  const canProceed = () => {
    return (
      pickupLocation &&
      dropoffLocation &&
      distanceKm &&
      distanceKm > 0 &&
      selectedVehicle &&
      pickupDatetime &&
      passengerCount
    );
  };

  const handleProceed = () => {
    if (canProceed()) {
      // Store booking data in localStorage for demo
      const bookingData = {
        pickupLocation,
        dropoffLocation,
        distanceKm,
        passengerCount,
        pickupDatetime,
        selectedVehicle
      };
      localStorage.setItem('demoBookingData', JSON.stringify(bookingData));
      router.push('/booking/confirm');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Book Your Ride</h1>
          <p className="text-muted-foreground mb-8">
            Enter your trip details and choose your preferred vehicle
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Trip Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickup">Pickup Location</Label>
                      <Input
                        id="pickup"
                        placeholder="e.g., Bandaranaike International Airport, Katunayake"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dropoff">Drop-off Location</Label>
                      <Input
                        id="dropoff"
                        placeholder="e.g., Galle Face Hotel, Colombo 03"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="distance">Distance (km)</Label>
                        <Input
                          id="distance"
                          type="number"
                          placeholder="50"
                          value={distanceKm || ''}
                          onChange={(e) => setDistanceKm(Number(e.target.value))}
                          className="mt-2"
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="passengers">Passengers</Label>
                        <Input
                          id="passengers"
                          type="number"
                          placeholder="2"
                          value={passengerCount}
                          onChange={(e) => setPassengerCount(Number(e.target.value))}
                          className="mt-2"
                          min="1"
                          max="9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="datetime">Pickup Date & Time</Label>
                      <Input
                        id="datetime"
                        type="datetime-local"
                        value={pickupDatetime}
                        onChange={(e) => setPickupDatetime(e.target.value)}
                        className="mt-2"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Choose Your Vehicle
                  </h2>
                  {loading ? (
                    <div className="text-center py-8">Loading vehicles...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicles.map((vehicle) => {
                        const fare = distanceKm
                          ? calculateFare(distanceKm, vehicle.base_fare, vehicle.price_per_km)
                          : vehicle.base_fare;
                        const isSelected = selectedVehicle?.id === vehicle.id;

                        return (
                          <Card
                            key={vehicle.id}
                            className={`cursor-pointer transition-all ${
                              isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                            }`}
                            onClick={() => handleVehicleSelect(vehicle)}
                          >
                            <CardContent className="p-4">
                              <div className="aspect-video relative mb-3 rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={vehicle.image_url}
                                  alt={vehicle.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <h3 className="font-semibold text-lg mb-2">{vehicle.name}</h3>
                              <div className="flex gap-2 mb-3">
                                <Badge variant="secondary">
                                  <Users className="h-3 w-3 mr-1" />
                                  {vehicle.capacity}
                                </Badge>
                                {vehicle.has_ac && (
                                  <Badge variant="secondary">AC</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                Base: {formatCurrency(vehicle.base_fare)} + {formatCurrency(vehicle.price_per_km)}/km
                              </div>
                              <div className="text-xl font-bold text-primary">
                                {formatCurrency(fare)}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Fare Summary</h2>
                  {selectedVehicle && distanceKm ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Vehicle</div>
                        <div className="font-medium">{selectedVehicle.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Distance</div>
                        <div className="font-medium">{distanceKm} km</div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Base Fare</span>
                          <span>{formatCurrency(selectedVehicle.base_fare)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Distance ({distanceKm} km)</span>
                          <span>
                            {formatCurrency(distanceKm * selectedVehicle.price_per_km)}
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Fare</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(
                              calculateFare(
                                distanceKm,
                                selectedVehicle.base_fare,
                                selectedVehicle.price_per_km
                              )
                            )}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={handleProceed}
                        disabled={!canProceed()}
                        className="w-full"
                        size="lg"
                      >
                        Continue to Confirmation
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Select a vehicle and enter distance to see fare estimate
                    </div>
                  )}
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