
-- Create admin_users table
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

-- Create taxi_packages table
CREATE TABLE IF NOT EXISTS taxi_packages (
  id SERIAL PRIMARY KEY,
  package_name VARCHAR(255) NOT NULL,
  package_code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'economy', 'standard', 'luxury', 'van'
  base_price DECIMAL(10, 2) NOT NULL,
  price_per_km DECIMAL(10, 2) NOT NULL,
  included_km INTEGER DEFAULT 0,
  max_passengers INTEGER NOT NULL,
  duration_hours INTEGER NOT NULL,
  features JSONB DEFAULT '[]',
  vehicle_types JSONB DEFAULT '[]', -- Array of vehicle IDs or types
  popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  image VARCHAR(500),
  terms_conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_packages_category ON taxi_packages(category);
CREATE INDEX idx_packages_active ON taxi_packages(is_active);
CREATE INDEX idx_packages_popular ON taxi_packages(popular);

-- Insert default admin user (password: Admin@123)
-- Password hash is bcrypt hash of 'Admin@123'
INSERT INTO admin_users (username, password_hash, email, full_name) 
VALUES (
  'admin',
  '$2b$10$rGxVXxP5KzO4K4mVYxJF5.7N6vK7N9z5zQxJKq5kYxY7F5z7N9z5z',
  'admin@taxisrilanka.com',
  'System Administrator'
) ON CONFLICT (username) DO NOTHING;

-- Add some sample packages
INSERT INTO taxi_packages (
  package_name, package_code, description, category, 
  base_price, price_per_km, included_km, max_passengers, 
  duration_hours, features, popular, image
) VALUES 
(
  'City Tour - Half Day',
  'PKG-CITY-HALF',
  'Perfect for exploring the city within 4 hours',
  'economy',
  3500.00,
  50.00,
  50,
  4,
  4,
  '["Air Conditioning", "Professional Driver", "Fuel Included", "City Guide"]',
  true,
  '/images/packages/city-tour.jpg'
),
(
  'Airport Transfer Premium',
  'PKG-AIRPORT-PREM',
  'Luxury airport pickup and drop service',
  'luxury',
  5000.00,
  75.00,
  30,
  3,
  2,
  '["Meet & Greet", "Luggage Assistance", "Water Bottles", "WiFi", "Child Seat Available"]',
  true,
  '/images/packages/airport-premium.jpg'
),
(
  'Full Day Rental',
  'PKG-FULLDAY-STD',
  'Rent a taxi for the entire day - 8 hours',
  'standard',
  6500.00,
  45.00,
  100,
  4,
  8,
  '["Air Conditioning", "Professional Driver", "Fuel Included", "Flexible Routes"]',
  true,
  '/images/packages/full-day.jpg'
)
ON CONFLICT (package_code) DO NOTHING;
