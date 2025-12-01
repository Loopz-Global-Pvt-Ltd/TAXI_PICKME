
-- Create bookings table with updated schema (without base_price and number_of_days)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  pickup_location VARCHAR(500) NOT NULL,
  dropoff_location VARCHAR(500) NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  estimated_distance_km DECIMAL(10, 2) NOT NULL,
  distance_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_pickup_date ON bookings(pickup_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);

-- Add comments for clarity
COMMENT ON TABLE bookings IS 'Customer taxi booking records';
COMMENT ON COLUMN bookings.distance_price IS 'Total price calculated as: price_per_km * estimated_distance_km';
COMMENT ON COLUMN bookings.total_price IS 'Same as distance_price (distance-based pricing only)';
COMMENT ON COLUMN bookings.estimated_distance_km IS 'Estimated distance in kilometers for the trip';
COMMENT ON COLUMN bookings.status IS 'Booking status: pending, confirmed, completed, cancelled';
COMMENT ON COLUMN bookings.payment_status IS 'Payment status: unpaid, paid, refunded';
