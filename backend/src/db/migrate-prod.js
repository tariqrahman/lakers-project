import pg from 'pg';

const { Pool } = pg;

// Use the production database URL
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_f5jlTJ1LQXbF@ep-withered-forest-a58jcs89-pooler.us-east-2.aws.neon.tech/neondb',
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

async function migrateProd() {
  const client = await pool.connect();
  
  try {
    console.log('Starting production database migration...');
    
    // Start transaction
    await client.query('BEGIN');

    console.log('Creating draft_picks table...');
    // Create draft picks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS draft_picks (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id),
        season INTEGER NOT NULL,
        first_rd TEXT,
        second_rd TEXT,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(team_id, season)
      );
    `);

    // Commit transaction
    await client.query('COMMIT');
    
    console.log('✅ Production database migration completed successfully');
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during production migration:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrateProd(); 