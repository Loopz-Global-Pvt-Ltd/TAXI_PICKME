export interface Customer {
  id: string;
  phone: string;
  name: string;
  email?: string;
  is_active: boolean;
  created_at: string;
}

export interface VehicleCategory {
  id: string;
  name: string;
  capacity: number;
  has_ac: boolean;
  base_fare: number;
  price_per_km: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  license_number: string;
  vehicle_number: string;
  vehicle_category_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  reference_number: string;
  customer_id: string;
  driver_id?: string;
  vehicle_category_id: string;
  pickup_location: string;
  pickup_lat?: number;
  pickup_lng?: number;
  dropoff_location: string;
  dropoff_lat?: number;
  dropoff_lng?: number;
  distance_km: number;
  pickup_datetime: string;
  passenger_count: number;
  special_requests?: string;
  base_fare: number;
  total_fare: number;
  payment_method: 'online' | 'cash';
  payment_status: 'pending' | 'completed' | 'failed';
  booking_status: 'new' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  customer?: Customer;
  driver?: Driver;
  vehicle_category?: VehicleCategory;
}

export interface BookingForm {
  pickupLocation: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLocation: string;
  dropoffLat?: number;
  dropoffLng?: number;
  distanceKm: number;
  pickupDatetime: string;
  passengerCount: number;
  specialRequests?: string;
  vehicleCategoryId: string;
  paymentMethod: 'online' | 'cash';
}
