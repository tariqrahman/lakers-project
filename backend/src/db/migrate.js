import pool from './config.js';
import { teams } from './teams.js';

async function migrate() {
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');

    // Create teams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

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

    // Insert team data
    for (const team of teams) {
      await client.query(
        'INSERT INTO teams (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = $2',
        [team.id, team.name]
      );
    }

    // Commit transaction
    await client.query('COMMIT');
    
    console.log('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during migration:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

// Run migration
migrate(); 