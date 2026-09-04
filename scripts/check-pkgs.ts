import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const connectionString = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .find(line => line.startsWith('DATABASE_URL='))
  ?.split('=')[1]
  ?.trim();

const pool = new Pool({ connectionString });

async function main() {
  const client = await pool.connect();
  try {
    const pkgs = await client.query('SELECT * FROM taxi_packages LIMIT 2');
    console.log('Packages:', pkgs.rows);
  } finally {
    client.release();
    pool.end();
  }
}

main();
