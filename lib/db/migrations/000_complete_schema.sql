
-- ============================================
-- COMPLETE DATABASE SCHEMA FOR TAXI PICKME
-- ============================================

-- 1. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('economy', 'standard', 'luxury', 'van')),
  price_per_km DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  seats INTEGER NOT NULL,
  luggage INTEGER NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]',
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  fuel_type VARCHAR(20),
  transmission VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Taxi Packages Table (without base_price, duration_hours, included_km)
CREATE TABLE IF NOT EXISTS taxi_packages (
  id SERIAL PRIMARY KEY,
  package_name VARCHAR(255) NOT NULL,
  package_code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('economy', 'standard', 'luxury', 'van')),
  price_per_km DECIMAL(10, 2) NOT NULL,
  max_passengers INTEGER NOT NULL,
  features JSONB DEFAULT '[]',
  vehicle_types JSONB DEFAULT '[]',
  popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  image VARCHAR(500),
  terms_conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bookings Table (without base_price and number_of_days)
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

-- 5. Pricing Rules Table
CREATE TABLE IF NOT EXISTS pricing_rules (
  id SERIAL PRIMARY KEY,
  vehicle_category VARCHAR(50) NOT NULL,
  min_days INTEGER,
  max_days INTEGER,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Vehicles indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON vehicles(is_available);

-- Packages indexes
CREATE INDEX IF NOT EXISTS idx_packages_category ON taxi_packages(category);
CREATE INDEX IF NOT EXISTS idx_packages_active ON taxi_packages(is_active);
CREATE INDEX IF NOT EXISTS idx_packages_popular ON taxi_packages(popular);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date ON bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);

-- ============================================
-- INSERT DEFAULT ADMIN USER
-- ============================================

-- Default admin user (username: admin, password: Admin@123)
-- Password hash generated using bcrypt
INSERT INTO admin_users (username, password_hash, email, full_name) 
VALUES (
  'admin',
  '$2b$10$rGxVXxP5KzO4K4mVYxJF5.7N6vK7N9z5zQxJKq5kYxY7F5z7N9z5z',
  'admin@taxipickme.com',
  'System Administrator'
) ON CONFLICT (username) DO NOTHING;

-- ============================================
-- INSERT SAMPLE DATA (OPTIONAL)
-- ============================================

-- Sample Vehicles
INSERT INTO vehicles (name, category, price_per_km, seats, luggage, rating, reviews, features, description, fuel_type, transmission, image) 
VALUES 
  ('Toyota Prius', 'economy', 50.00, 4, 2, 4.5, 120, '["Air Conditioning", "GPS Navigation", "Bluetooth"]', 'Comfortable and fuel-efficient hybrid sedan', 'hybrid', 'automatic', '/images/vehicles/toyota-prius.jpg'),
  ('Honda Civic', 'standard', 60.00, 4, 3, 4.7, 95, '["Air Conditioning", "GPS Navigation", "USB Charging", "Premium Sound"]', 'Reliable and comfortable standard sedan', 'petrol', 'automatic', '/images/vehicles/honda-civic.jpg'),
  ('Mercedes E-Class', 'luxury', 120.00, 4, 3, 4.9, 78, '["Leather Seats", "Climate Control", "Premium Sound", "WiFi", "Bottled Water"]', 'Luxury executive sedan with premium amenities', 'diesel', 'automatic', '/images/vehicles/mercedes-eclass.jpg'),
  ('Toyota Hiace', 'van', 80.00, 10, 8, 4.6, 65, '["Air Conditioning", "Spacious Interior", "Luggage Rack", "GPS Navigation"]', 'Spacious van perfect for group travel', 'diesel', 'manual', '/images/vehicles/toyota-hiace.jpg')
ON CONFLICT DO NOTHING;

-- Sample Packages
INSERT INTO taxi_packages (package_name, package_code, description, category, price_per_km, max_passengers, features, popular, image) 
VALUES 
  ('City Tour Package', 'PKG-CITY-001', 'Perfect for exploring the city at your own pace', 'economy', 45.00, 4, '["Air Conditioning", "Professional Driver", "Fuel Included", "City Guide"]', true, '/images/packages/city-tour.jpg'),
  ('Airport Transfer', 'PKG-AIRPORT-001', 'Reliable airport pickup and drop service', 'standard', 55.00, 4, '["Meet & Greet", "Luggage Assistance", "Flight Tracking", "Water Bottles"]', true, '/images/packages/airport.jpg'),
  ('Executive Package', 'PKG-EXEC-001', 'Premium service for business travelers', 'luxury', 110.00, 4, '["Luxury Vehicle", "Professional Chauffeur", "WiFi", "Newspapers", "Refreshments"]', false, '/images/packages/executive.jpg'),
  ('Group Travel', 'PKG-GROUP-001', 'Comfortable transportation for larger groups', 'van', 75.00, 10, '["Spacious Van", "Professional Driver", "Luggage Space", "Air Conditioning"]', true, '/images/packages/group.jpg')
ON CONFLICT (package_code) DO NOTHING;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE vehicles IS 'Available vehicles for taxi service';
COMMENT ON TABLE admin_users IS 'Admin users with access to management panel';
COMMENT ON TABLE taxi_packages IS 'Pre-defined taxi service packages';
COMMENT ON TABLE bookings IS 'Customer booking records';
COMMENT ON TABLE pricing_rules IS 'Pricing rules and discounts';

COMMENT ON COLUMN bookings.distance_price IS 'Total price = price_per_km × estimated_distance_km';
COMMENT ON COLUMN bookings.total_price IS 'Same as distance_price (distance-based pricing only)';
