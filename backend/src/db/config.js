import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../../.env') });

const { Pool } = pg;

// Use the production database URL in both environments for now
// This ensures we're always connecting to the same database
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_f5jlTJ1LQXbF@ep-withered-forest-a58jcs89-pooler.us-east-2.aws.neon.tech/neondb',
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

// Add error handler
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error testing database connection:', err);
  } else {
    console.log('Database connection successful:', res.rows[0]);
  }
});

export default pool; 