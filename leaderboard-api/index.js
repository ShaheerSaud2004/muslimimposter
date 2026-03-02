/**
 * Khafī global leaderboard API
 * Deploy to DigitalOcean App Platform; set DATABASE_URL in env.
 */
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
});

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// POST /leaderboard/submit – upsert one round for this device
app.post('/leaderboard/submit', async (req, res) => {
  try {
    const { device_id, display_name, won, imposter_win } = req.body;
    if (!device_id || !display_name || typeof display_name !== 'string') {
      return res.status(400).json({ error: 'device_id and display_name required' });
    }
    const name = display_name.trim().slice(0, 100);
    if (!name) return res.status(400).json({ error: 'display_name cannot be empty' });

    const wonBool = !!won;
    const imposterWinBool = !!imposter_win;

    await pool.query(
      `INSERT INTO leaderboard (device_id, display_name, rounds_played, rounds_won, imposter_wins, last_updated)
       VALUES ($1, $2, 1, $3, $4, NOW())
       ON CONFLICT (device_id) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         rounds_played = leaderboard.rounds_played + 1,
         rounds_won = leaderboard.rounds_won + EXCLUDED.rounds_won,
         imposter_wins = leaderboard.imposter_wins + EXCLUDED.imposter_wins,
         last_updated = NOW()`,
      [device_id, name, wonBool ? 1 : 0, imposterWinBool ? 1 : 0]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// GET /leaderboard?limit=50&device_id=xxx – top N and optional rank for device_id
app.get('/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const deviceId = req.query.device_id && String(req.query.device_id).trim();

    const top = await pool.query(
      `SELECT display_name, rounds_played, rounds_won, imposter_wins, last_updated
       FROM leaderboard
       ORDER BY rounds_won DESC, last_updated DESC
       LIMIT $1`,
      [limit]
    );

    let myRank = null;
    if (deviceId) {
      const me = await pool.query(
        'SELECT rounds_played, rounds_won, imposter_wins, last_updated FROM leaderboard WHERE device_id = $1',
        [deviceId]
      );
      if (me.rows.length > 0) {
        const r = await pool.query(
          `SELECT COUNT(*)::int AS better FROM leaderboard l
           WHERE (l.rounds_won, l.last_updated) > (SELECT rounds_won, last_updated FROM leaderboard WHERE device_id = $1)`,
          [deviceId]
        );
        myRank = {
          rank: (r.rows[0]?.better ?? 0) + 1,
          ...me.rows[0],
        };
      }
    }

    res.json({
      top: top.rows.map((row, i) => ({ rank: i + 1, ...row })),
      me: myRank,
    });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'leaderboard-api' });
});

// Root for health checks and load balancers that probe /
app.get('/', (req, res) => {
  res.redirect(302, '/health');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Leaderboard API listening on port ${PORT}`);
});
