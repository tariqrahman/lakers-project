import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../../.env') });

const { Pool } = pg;

let pool;

if (process.env.DATABASE_URL) {
  // Use connection string in production
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      require: true
    }
  });
} else {
  // Use individual connection parameters in development
  pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'nba_draft_picks',
    password: process.env.PGPASSWORD || 'postgres',
    port: process.env.PGPORT || 5432,
    ssl: {
      rejectUnauthorized: false,
      require: true
    }
  });
}

// Add error handler
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool; 