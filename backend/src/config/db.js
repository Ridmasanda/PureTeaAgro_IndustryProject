const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured in the environment.');
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function connectDB() {
  const client = await pool.connect();
  client.release();
  console.log('Supabase PostgreSQL connected successfully');
}

module.exports = { connectDB, pool };
