
-- Alter vehicles table - remove base_price
ALTER TABLE vehicles DROP COLUMN IF EXISTS base_price;

-- Alter taxi_packages table - remove base_price, duration_hours, included_km
ALTER TABLE taxi_packages 
  DROP COLUMN IF EXISTS base_price,
  DROP COLUMN IF EXISTS duration_hours,
  DROP COLUMN IF EXISTS included_km;

-- Alter bookings table - remove number_of_days, base_price
ALTER TABLE bookings 
  DROP COLUMN IF EXISTS number_of_days,
  DROP COLUMN IF EXISTS base_price;

-- Update bookings table calculation to only use distance pricing
-- Add a comment for clarity
COMMENT ON COLUMN bookings.distance_price IS 'Total price calculated as: price_per_km * estimated_distance_km';
COMMENT ON COLUMN bookings.total_price IS 'Same as distance_price (no base price anymore)';

-- Update existing bookings to recalculate (if any exist)
-- This is optional and depends on your data
UPDATE bookings 
SET total_price = distance_price 
WHERE total_price != distance_price;
