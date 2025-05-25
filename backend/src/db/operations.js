import pool from './config.js';

export async function upsertDraftPicks(teamId, picks) {
  const client = await pool.connect();
  try {
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
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getDraftPicksByTeam(teamId) {
  const result = await pool.query(
    `SELECT t.name as team_name, dp.season, dp.first_rd, dp.second_rd, dp.last_updated
     FROM draft_picks dp
     JOIN teams t ON t.id = dp.team_id
     WHERE dp.team_id = $1
     ORDER BY dp.season`,
    [teamId]
  );
  return result.rows;
}

export async function getAllDraftPicks() {
  const result = await pool.query(
    `SELECT t.name as team_name, dp.season, dp.first_rd, dp.second_rd, dp.last_updated
     FROM draft_picks dp
     JOIN teams t ON t.id = dp.team_id
     ORDER BY t.name, dp.season`
  );
  return result.rows;
}

export async function getTeamByName(teamName) {
  const result = await pool.query(
    'SELECT id, name FROM teams WHERE name ILIKE $1',
    [`%${teamName}%`]
  );
  return result.rows[0];
} 