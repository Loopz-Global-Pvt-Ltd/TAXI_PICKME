
-- Backup pricing_configs data to vehicles table (if needed)
-- This ensures any category defaults are preserved in vehicle records
UPDATE vehicles v
SET 
  base_rate = COALESCE(v.base_rate, pc.base_rate),
  minimum_fare = COALESCE(v.minimum_fare, pc.minimum_fare),
  tier_1_upto_km = COALESCE(v.tier_1_upto_km, pc.tier_1_upto_km),
  tier_1_multiplier = COALESCE(v.tier_1_multiplier, pc.tier_1_multiplier),
  tier_2_upto_km = COALESCE(v.tier_2_upto_km, pc.tier_2_upto_km),
  tier_2_multiplier = COALESCE(v.tier_2_multiplier, pc.tier_2_multiplier),
  tier_3_upto_km = COALESCE(v.tier_3_upto_km, pc.tier_3_upto_km),
  tier_3_multiplier = COALESCE(v.tier_3_multiplier, pc.tier_3_multiplier),
  tier_4_upto_km = COALESCE(v.tier_4_upto_km, pc.tier_4_upto_km),
  tier_4_multiplier = COALESCE(v.tier_4_multiplier, pc.tier_4_multiplier),
  tier_5_upto_km = COALESCE(v.tier_5_upto_km, pc.tier_5_upto_km),
  tier_5_multiplier = COALESCE(v.tier_5_multiplier, pc.tier_5_multiplier),
  tier_6_upto_km = COALESCE(v.tier_6_upto_km, pc.tier_6_upto_km),
  tier_6_multiplier = COALESCE(v.tier_6_multiplier, pc.tier_6_multiplier),
  tier_7_upto_km = COALESCE(v.tier_7_upto_km, pc.tier_7_upto_km),
  tier_7_multiplier = COALESCE(v.tier_7_multiplier, pc.tier_7_multiplier),
  tier_8_upto_km = COALESCE(v.tier_8_upto_km, pc.tier_8_upto_km),
  tier_8_multiplier = COALESCE(v.tier_8_multiplier, pc.tier_8_multiplier),
  tier_9_upto_km = COALESCE(v.tier_9_upto_km, pc.tier_9_upto_km),
  tier_9_multiplier = COALESCE(v.tier_9_multiplier, pc.tier_9_multiplier),
  tier_10_upto_km = COALESCE(v.tier_10_upto_km, pc.tier_10_upto_km),
  tier_10_multiplier = COALESCE(v.tier_10_multiplier, pc.tier_10_multiplier),
  tier_11_upto_km = COALESCE(v.tier_11_upto_km, pc.tier_11_upto_km),
  tier_11_multiplier = COALESCE(v.tier_11_multiplier, pc.tier_11_multiplier),
  tier_12_multiplier = COALESCE(v.tier_12_multiplier, pc.tier_12_multiplier)
FROM pricing_configs pc
WHERE v.category = pc.vehicle_category;

-- Drop the pricing_configs table
DROP TABLE IF EXISTS pricing_configs CASCADE;

-- Remove use_category_pricing column (no longer needed)
ALTER TABLE vehicles DROP COLUMN IF EXISTS use_category_pricing;

-- Add helpful comments
COMMENT ON TABLE vehicles IS 'Vehicle inventory with integrated tier-based pricing';
COMMENT ON COLUMN vehicles.base_rate IS 'Base rate per km (used with tier multipliers)';
COMMENT ON COLUMN vehicles.minimum_fare IS 'Minimum fare for this vehicle';

-- Create view for easy pricing queries (optional but helpful)
CREATE OR REPLACE VIEW vehicle_pricing_summary AS
SELECT 
  id,
  name,
  category,
  base_rate,
  minimum_fare,
  tier_1_upto_km, tier_1_multiplier,
  tier_2_upto_km, tier_2_multiplier,
  tier_3_upto_km, tier_3_multiplier,
  tier_4_upto_km, tier_4_multiplier,
  tier_5_upto_km, tier_5_multiplier,
  tier_6_upto_km, tier_6_multiplier,
  tier_7_upto_km, tier_7_multiplier,
  tier_8_upto_km, tier_8_multiplier,
  tier_9_upto_km, tier_9_multiplier,
  tier_10_upto_km, tier_10_multiplier,
  tier_11_upto_km, tier_11_multiplier,
  tier_12_multiplier,
  is_available
FROM vehicles
ORDER BY category, name;

COMMENT ON VIEW vehicle_pricing_summary IS 'Simplified view of vehicle pricing configuration';
