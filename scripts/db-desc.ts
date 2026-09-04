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
  try {
    const { rows } = await client.query('SELECT * FROM vehicles LIMIT 1');
    if (rows.length > 0) {
      console.log('Columns: ', Object.keys(rows[0]));
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
