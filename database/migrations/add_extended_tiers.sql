
-- Add new tier columns to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_5_upto_km INTEGER DEFAULT 100;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_5_multiplier DECIMAL(4, 2) DEFAULT 0.7;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_6_upto_km INTEGER DEFAULT 150;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_6_multiplier DECIMAL(4, 2) DEFAULT 0.65;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_7_upto_km INTEGER DEFAULT 200;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_7_multiplier DECIMAL(4, 2) DEFAULT 0.6;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_8_upto_km INTEGER DEFAULT 250;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_8_multiplier DECIMAL(4, 2) DEFAULT 0.55;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_9_upto_km INTEGER DEFAULT 300;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_9_multiplier DECIMAL(4, 2) DEFAULT 0.5;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_10_upto_km INTEGER DEFAULT 350;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_10_multiplier DECIMAL(4, 2) DEFAULT 0.48;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_11_upto_km INTEGER DEFAULT 400;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_11_multiplier DECIMAL(4, 2) DEFAULT 0.45;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tier_12_multiplier DECIMAL(4, 2) DEFAULT 0.42;

-- Add new tier columns to pricing_configs table
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_5_upto_km INTEGER DEFAULT 100;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_5_multiplier DECIMAL(4, 2) DEFAULT 0.7;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_6_upto_km INTEGER DEFAULT 150;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_6_multiplier DECIMAL(4, 2) DEFAULT 0.65;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_7_upto_km INTEGER DEFAULT 200;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_7_multiplier DECIMAL(4, 2) DEFAULT 0.6;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_8_upto_km INTEGER DEFAULT 250;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_8_multiplier DECIMAL(4, 2) DEFAULT 0.55;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_9_upto_km INTEGER DEFAULT 300;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_9_multiplier DECIMAL(4, 2) DEFAULT 0.5;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_10_upto_km INTEGER DEFAULT 350;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_10_multiplier DECIMAL(4, 2) DEFAULT 0.48;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_11_upto_km INTEGER DEFAULT 400;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_11_multiplier DECIMAL(4, 2) DEFAULT 0.45;
ALTER TABLE pricing_configs ADD COLUMN IF NOT EXISTS tier_12_multiplier DECIMAL(4, 2) DEFAULT 0.42;

-- Update existing vehicles with default values from their category
UPDATE vehicles v
SET 
  tier_5_upto_km = 100,
  tier_5_multiplier = 0.7,
  tier_6_upto_km = 150,
  tier_6_multiplier = 0.65,
  tier_7_upto_km = 200,
  tier_7_multiplier = 0.6,
  tier_8_upto_km = 250,
  tier_8_multiplier = 0.55,
  tier_9_upto_km = 300,
  tier_9_multiplier = 0.5,
  tier_10_upto_km = 350,
  tier_10_multiplier = 0.48,
  tier_11_upto_km = 400,
  tier_11_multiplier = 0.45,
  tier_12_multiplier = 0.42
WHERE tier_5_upto_km IS NULL;

-- Update pricing configs with default values
UPDATE pricing_configs
SET 
  tier_5_upto_km = 100,
  tier_5_multiplier = 0.7,
  tier_6_upto_km = 150,
  tier_6_multiplier = 0.65,
  tier_7_upto_km = 200,
  tier_7_multiplier = 0.6,
  tier_8_upto_km = 250,
  tier_8_multiplier = 0.55,
  tier_9_upto_km = 300,
  tier_9_multiplier = 0.5,
  tier_10_upto_km = 350,
  tier_10_multiplier = 0.48,
  tier_11_upto_km = 400,
  tier_11_multiplier = 0.45,
  tier_12_multiplier = 0.42
WHERE tier_5_upto_km IS NULL;

COMMENT ON COLUMN vehicles.tier_5_upto_km IS 'Tier 5: 60-100 km';
COMMENT ON COLUMN vehicles.tier_6_upto_km IS 'Tier 6: 100-150 km';
COMMENT ON COLUMN vehicles.tier_7_upto_km IS 'Tier 7: 150-200 km';
COMMENT ON COLUMN vehicles.tier_8_upto_km IS 'Tier 8: 200-250 km';
COMMENT ON COLUMN vehicles.tier_9_upto_km IS 'Tier 9: 250-300 km';
COMMENT ON COLUMN vehicles.tier_10_upto_km IS 'Tier 10: 300-350 km';
COMMENT ON COLUMN vehicles.tier_11_upto_km IS 'Tier 11: 350-400 km';
COMMENT ON COLUMN vehicles.tier_12_multiplier IS 'Tier 12: 400+ km';
