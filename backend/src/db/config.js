import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../../.env') });

const { Pool } = pg;

// Create a new pool for each request in serverless environment
const getPool = () => {
  return new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_f5jlTJ1LQXbF@ep-withered-forest-a58jcs89-pooler.us-east-2.aws.neon.tech/neondb',
    ssl: {
      rejectUnauthorized: false,
      require: true
    },
    // Add connection timeout
    connectionTimeoutMillis: 5000,
    // Reduce pool size for serverless
    max: 1,
    // Add idle timeout
    idleTimeoutMillis: 120000
  });
};

// Add error handler
getPool().on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test the connection
getPool().query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error testing database connection:', err);
  } else {
    console.log('Database connection successful:', res.rows[0]);
  }
});

export default getPool; 