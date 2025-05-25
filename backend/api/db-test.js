import getPool from '../src/db/config.js';

export default async function handler(req, res) {
  const pool = getPool();
  let client;

  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as time');
    res.json({
      status: 'Database connection successful',
      time: result.rows[0].time,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    if (client) await client.release();
    await pool.end();
  }
} 