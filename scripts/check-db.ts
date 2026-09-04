import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

const readUrl = (p: string) => {
  if (fs.existsSync(p)) {
    const envContent = fs.readFileSync(p, 'utf8');
    return envContent
      .split('\n')
      .find(line => line.startsWith('DATABASE_URL='))
      ?.split('=')[1]
      ?.trim();
  }
  return null;
}

const url = readUrl(envLocalPath) || readUrl(envPath);

const pool = new Pool({
  connectionString: url
});

async function main() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', rows.map(r => r.table_name));

    const columns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'vehicles'
    `);
    console.log('Vehicle columns:', columns.rows.map(r => r.column_name));
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
