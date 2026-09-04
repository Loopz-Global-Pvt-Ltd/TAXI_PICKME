import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const connectionString = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .find(line => line.startsWith('DATABASE_URL='))
  ?.split('=')[1]
  ?.trim();

const pool = new Pool({
  connectionString
});

async function main() {
  const client = await pool.connect();
  console.log('Connected to DB...');

  try {
    await client.query('BEGIN');

    // 1. Create exchange_rates table
    console.log('Creating exchange_rates table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS exchange_rates (
        currency_code VARCHAR(3) PRIMARY KEY,
        rate NUMERIC(10,4) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      INSERT INTO exchange_rates (currency_code, rate) VALUES 
      ('USD', 1.0000),
      ('LKR', 300.0000),
      ('EUR', 0.9200)
      ON CONFLICT (currency_code) DO NOTHING;
    `);

    // 2. Add missing columns to vehicles table
    console.log('Adding missing tier columns to vehicles...');
    await client.query(`
      ALTER TABLE vehicles
      ADD COLUMN IF NOT EXISTS base_rate NUMERIC(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS minimum_fare NUMERIC(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_1_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_1_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_2_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_2_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_3_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_3_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_4_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_4_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_5_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_5_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_6_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_6_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_7_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_7_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_8_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_8_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_9_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_9_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_10_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_10_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_11_upto_km INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_11_multiplier NUMERIC(10,2) DEFAULT 1.0,
      ADD COLUMN IF NOT EXISTS tier_12_multiplier NUMERIC(10,2) DEFAULT 1.0;
    `);

    // 3. Convert prices from LKR to USD if they are still in LKR (> 50 means LKR)
    console.log('Converting prices over to USD (if stored as LKR)...');
    await client.query(`
      UPDATE vehicles 
      SET price_per_km = ROUND((price_per_km / 300)::numeric, 2)
      WHERE price_per_km > 50;
    `);

    await client.query(`
      UPDATE vehicles 
      SET 
        base_rate = ROUND((base_rate / 300)::numeric, 2),
        minimum_fare = ROUND((minimum_fare / 300)::numeric, 2)
      WHERE base_rate > 50;
    `);

    await client.query('COMMIT');
    console.log('Database successfully fixed!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error fixing DB:', error);
  } finally {
    client.release();
    pool.end();
  }
}

main();
