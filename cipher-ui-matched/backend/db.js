import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
});
pool.on('error', err => console.error('PostgreSQL pool error:', err));
export const query = (text, params) => pool.query(text, params);
