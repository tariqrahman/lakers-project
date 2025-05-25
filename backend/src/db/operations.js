import getPool from './config.js';

export async function upsertDraftPicks(teamId, picks) {
  const pool = getPool();
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    for (const pick of picks) {
      await client.query(
        `INSERT INTO draft_picks (team_id, season, first_rd, second_rd)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (team_id, season)
         DO UPDATE SET
           first_rd = $3,
           second_rd = $4,
           last_updated = CURRENT_TIMESTAMP`,
        [teamId, parseInt(pick.year), pick.firstRound, pick.secondRound]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('Error in upsertDraftPicks:', error);
    throw error;
  } finally {
    if (client) await client.release();
    await pool.end();
  }
}

export async function getDraftPicksByTeam(teamId) {
  const pool = getPool();
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT t.name as team_name, dp.season, dp.first_rd, dp.second_rd, dp.last_updated
       FROM draft_picks dp
       JOIN teams t ON t.id = dp.team_id
       WHERE dp.team_id = $1
       ORDER BY dp.season`,
      [teamId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getDraftPicksByTeam:', error);
    throw error;
  } finally {
    if (client) await client.release();
    await pool.end();
  }
}

export async function getAllDraftPicks() {
  const pool = getPool();
  let client;
  
  try {
    client = await pool.connect();
    console.log('Connected to database successfully');
    
    const result = await client.query(
      `SELECT t.name as team_name, dp.season, dp.first_rd, dp.second_rd, dp.last_updated
       FROM draft_picks dp
       JOIN teams t ON t.id = dp.team_id
       ORDER BY t.name, dp.season`
    );
    
    console.log(`Retrieved ${result.rows.length} draft picks`);
    return result.rows;
  } catch (error) {
    console.error('Database Error in getAllDraftPicks:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  } finally {
    if (client) {
      await client.release();
      console.log('Database connection released');
    }
    // Close the pool in serverless environment
    await pool.end();
  }
}

export async function getTeamByName(teamName) {
  const pool = getPool();
  let client;
  
  try {
    client = await pool.connect();
    const result = await client.query(
      'SELECT id, name FROM teams WHERE name ILIKE $1',
      [`%${teamName}%`]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in getTeamByName:', error);
    throw error;
  } finally {
    if (client) await client.release();
    await pool.end();
  }
} 