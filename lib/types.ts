export interface Vehicle {
    id: number
    name: string
    category: string
    base_price: number
    price_per_km: number
    image: string | null
    seats: number
    luggage: number
    rating: number
    reviews: number
    features: string[]
    description: string
    is_available: boolean
    fuel_type: string
    transmission: string
    created_at: string
    updated_at: string
  }
  
  export interface Booking {
    id: number
    booking_reference: string
    vehicle_id: number
    full_name: string
    email: string
    phone: string
    pickup_location: string
    dropoff_location: string
    pickup_date: string
    pickup_time: string
    number_of_days: number
    estimated_distance_km: number | null
    base_price: number
    distance_price: number
    total_price: number
    special_requests: string | null
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    payment_status: 'unpaid' | 'paid' | 'refunded'
    payment_method: string | null
    created_at: string
    updated_at: string
  }
  
  export interface PricingCalculation {
    basePrice: number
    distancePrice: number
    discount: number
    totalPrice: number
    priceBreakdown: {
      dailyRate: number
      numberOfDays: number
      estimatedDistance: number
      pricePerKm: number
      discountPercentage: number
    }
  }