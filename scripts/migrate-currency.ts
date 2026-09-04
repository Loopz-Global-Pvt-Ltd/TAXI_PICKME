import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const connectionString = envContent
  .split('\n')
  .find(line => line.startsWith('DATABASE_URL='))
  ?.split('=')[1]
  ?.trim();

const pool = new Pool({
  connectionString
});

async function main() {
  const client = await pool.connect();
  console.log('Connected to DB for migration');

  try {
    await client.query('BEGIN');
    console.log('Creating exchange_rates table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS exchange_rates (
        currency_code VARCHAR(3) PRIMARY KEY,
        rate NUMERIC(10,4) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Fetching live exchange rates...');
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    const lkrRate = data.rates.LKR;
    const eurRate = data.rates.EUR;
    
    if (!lkrRate) throw new Error('Could not fetch LKR rate');
    console.log(`Current LKR rate: 1 USD = ${lkrRate} LKR`);

    await client.query(`
      INSERT INTO exchange_rates (currency_code, rate)
      VALUES 
        ('USD', 1.0000),
        ('LKR', $1),
        ('EUR', $2)
      ON CONFLICT (currency_code) DO UPDATE 
      SET rate = EXCLUDED.rate, last_updated = CURRENT_TIMESTAMP
    `, [lkrRate, eurRate]);

    const { rows } = await client.query('SELECT price_per_km FROM vehicles LIMIT 1');
    if (rows.length > 0) {
      if (parseFloat(rows[0].price_per_km) > 50) {
        console.log('price_per_km appears to be in LKR. Applying conversion to USD...');
        const updateRes = await client.query(`
          UPDATE vehicles 
          SET 
            price_per_km = ROUND((price_per_km / $1)::numeric, 2)
        `, [lkrRate]);
        console.log(`Updated ${updateRes.rowCount} vehicles.`);
      }
    }

    try {
      // Also try base_rate if it exists in another db env
      await client.query(`
        UPDATE vehicles 
        SET base_rate = ROUND((base_rate / $1)::numeric, 2),
            minimum_fare = ROUND((minimum_fare / $2)::numeric, 2)
        WHERE base_rate > 50
      `, [lkrRate, lkrRate]);
      console.log('Updated base_rate and minimum_fare to USD.');
    } catch (e) {
      // ignore if columns don't exist
    }

    await client.query('COMMIT');
    console.log('Migration completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
  } finally {
    client.release();
    pool.end();
  }
}

main();
