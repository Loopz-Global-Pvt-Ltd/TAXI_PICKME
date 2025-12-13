
-- First, check if columns exist before adding
DO $$ 
BEGIN
    -- Add tier_4_upto_km if it doesn't exist (needed for consistency)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='vehicles' AND column_name='tier_4_upto_km') THEN
        ALTER TABLE vehicles ADD COLUMN tier_4_upto_km INTEGER DEFAULT 60;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pricing_configs' AND column_name='tier_4_upto_km') THEN
        ALTER TABLE pricing_configs ADD COLUMN tier_4_upto_km INTEGER DEFAULT 60;
    END IF;

    -- Add remaining tier columns for vehicles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='vehicles' AND column_name='tier_5_upto_km') THEN
        ALTER TABLE vehicles ADD COLUMN tier_5_upto_km INTEGER DEFAULT 100;
        ALTER TABLE vehicles ADD COLUMN tier_5_multiplier DECIMAL(4, 2) DEFAULT 0.7;
        ALTER TABLE vehicles ADD COLUMN tier_6_upto_km INTEGER DEFAULT 150;
        ALTER TABLE vehicles ADD COLUMN tier_6_multiplier DECIMAL(4, 2) DEFAULT 0.65;
        ALTER TABLE vehicles ADD COLUMN tier_7_upto_km INTEGER DEFAULT 200;
        ALTER TABLE vehicles ADD COLUMN tier_7_multiplier DECIMAL(4, 2) DEFAULT 0.6;
        ALTER TABLE vehicles ADD COLUMN tier_8_upto_km INTEGER DEFAULT 250;
        ALTER TABLE vehicles ADD COLUMN tier_8_multiplier DECIMAL(4, 2) DEFAULT 0.55;
        ALTER TABLE vehicles ADD COLUMN tier_9_upto_km INTEGER DEFAULT 300;
        ALTER TABLE vehicles ADD COLUMN tier_9_multiplier DECIMAL(4, 2) DEFAULT 0.5;
        ALTER TABLE vehicles ADD COLUMN tier_10_upto_km INTEGER DEFAULT 350;
        ALTER TABLE vehicles ADD COLUMN tier_10_multiplier DECIMAL(4, 2) DEFAULT 0.48;
        ALTER TABLE vehicles ADD COLUMN tier_11_upto_km INTEGER DEFAULT 400;
        ALTER TABLE vehicles ADD COLUMN tier_11_multiplier DECIMAL(4, 2) DEFAULT 0.45;
        ALTER TABLE vehicles ADD COLUMN tier_12_multiplier DECIMAL(4, 2) DEFAULT 0.42;
    END IF;

    -- Add remaining tier columns for pricing_configs
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pricing_configs' AND column_name='tier_5_upto_km') THEN
        ALTER TABLE pricing_configs ADD COLUMN tier_5_upto_km INTEGER DEFAULT 100;
        ALTER TABLE pricing_configs ADD COLUMN tier_5_multiplier DECIMAL(4, 2) DEFAULT 0.7;
        ALTER TABLE pricing_configs ADD COLUMN tier_6_upto_km INTEGER DEFAULT 150;
        ALTER TABLE pricing_configs ADD COLUMN tier_6_multiplier DECIMAL(4, 2) DEFAULT 0.65;
        ALTER TABLE pricing_configs ADD COLUMN tier_7_upto_km INTEGER DEFAULT 200;
        ALTER TABLE pricing_configs ADD COLUMN tier_7_multiplier DECIMAL(4, 2) DEFAULT 0.6;
        ALTER TABLE pricing_configs ADD COLUMN tier_8_upto_km INTEGER DEFAULT 250;
        ALTER TABLE pricing_configs ADD COLUMN tier_8_multiplier DECIMAL(4, 2) DEFAULT 0.55;
        ALTER TABLE pricing_configs ADD COLUMN tier_9_upto_km INTEGER DEFAULT 300;
        ALTER TABLE pricing_configs ADD COLUMN tier_9_multiplier DECIMAL(4, 2) DEFAULT 0.5;
        ALTER TABLE pricing_configs ADD COLUMN tier_10_upto_km INTEGER DEFAULT 350;
        ALTER TABLE pricing_configs ADD COLUMN tier_10_multiplier DECIMAL(4, 2) DEFAULT 0.48;
        ALTER TABLE pricing_configs ADD COLUMN tier_11_upto_km INTEGER DEFAULT 400;
        ALTER TABLE pricing_configs ADD COLUMN tier_11_multiplier DECIMAL(4, 2) DEFAULT 0.45;
        ALTER TABLE pricing_configs ADD COLUMN tier_12_multiplier DECIMAL(4, 2) DEFAULT 0.42;
    END IF;
END $$;

-- Update existing rows with default values if they're NULL
UPDATE vehicles
SET 
  tier_4_upto_km = COALESCE(tier_4_upto_km, 60),
  tier_5_upto_km = COALESCE(tier_5_upto_km, 100),
  tier_5_multiplier = COALESCE(tier_5_multiplier, 0.7),
  tier_6_upto_km = COALESCE(tier_6_upto_km, 150),
  tier_6_multiplier = COALESCE(tier_6_multiplier, 0.65),
  tier_7_upto_km = COALESCE(tier_7_upto_km, 200),
  tier_7_multiplier = COALESCE(tier_7_multiplier, 0.6),
  tier_8_upto_km = COALESCE(tier_8_upto_km, 250),
  tier_8_multiplier = COALESCE(tier_8_multiplier, 0.55),
  tier_9_upto_km = COALESCE(tier_9_upto_km, 300),
  tier_9_multiplier = COALESCE(tier_9_multiplier, 0.5),
  tier_10_upto_km = COALESCE(tier_10_upto_km, 350),
  tier_10_multiplier = COALESCE(tier_10_multiplier, 0.48),
  tier_11_upto_km = COALESCE(tier_11_upto_km, 400),
  tier_11_multiplier = COALESCE(tier_11_multiplier, 0.45),
  tier_12_multiplier = COALESCE(tier_12_multiplier, 0.42);

UPDATE pricing_configs
SET 
  tier_4_upto_km = COALESCE(tier_4_upto_km, 60),
  tier_5_upto_km = COALESCE(tier_5_upto_km, 100),
  tier_5_multiplier = COALESCE(tier_5_multiplier, 0.7),
  tier_6_upto_km = COALESCE(tier_6_upto_km, 150),
  tier_6_multiplier = COALESCE(tier_6_multiplier, 0.65),
  tier_7_upto_km = COALESCE(tier_7_upto_km, 200),
  tier_7_multiplier = COALESCE(tier_7_multiplier, 0.6),
  tier_8_upto_km = COALESCE(tier_8_upto_km, 250),
  tier_8_multiplier = COALESCE(tier_8_multiplier, 0.55),
  tier_9_upto_km = COALESCE(tier_9_upto_km, 300),
  tier_9_multiplier = COALESCE(tier_9_multiplier, 0.5),
  tier_10_upto_km = COALESCE(tier_10_upto_km, 350),
  tier_10_multiplier = COALESCE(tier_10_multiplier, 0.48),
  tier_11_upto_km = COALESCE(tier_11_upto_km, 400),
  tier_11_multiplier = COALESCE(tier_11_multiplier, 0.45),
  tier_12_multiplier = COALESCE(tier_12_multiplier, 0.42);

-- Add helpful comments
COMMENT ON COLUMN vehicles.tier_1_upto_km IS 'Tier 1: 0-10 km (default)';
COMMENT ON COLUMN vehicles.tier_2_upto_km IS 'Tier 2: 10-25 km (default)';
COMMENT ON COLUMN vehicles.tier_3_upto_km IS 'Tier 3: 25-60 km (default)';
COMMENT ON COLUMN vehicles.tier_4_upto_km IS 'Tier 4: 60-100 km (default)';
COMMENT ON COLUMN vehicles.tier_5_upto_km IS 'Tier 5: 100-150 km';
COMMENT ON COLUMN vehicles.tier_6_upto_km IS 'Tier 6: 150-200 km';
COMMENT ON COLUMN vehicles.tier_7_upto_km IS 'Tier 7: 200-250 km';
COMMENT ON COLUMN vehicles.tier_8_upto_km IS 'Tier 8: 250-300 km';
COMMENT ON COLUMN vehicles.tier_9_upto_km IS 'Tier 9: 300-350 km';
COMMENT ON COLUMN vehicles.tier_10_upto_km IS 'Tier 10: 350-400 km';
COMMENT ON COLUMN vehicles.tier_11_upto_km IS 'Tier 11: 400-450 km';
COMMENT ON COLUMN vehicles.tier_12_multiplier IS 'Tier 12: 450+ km (no upper limit)';
