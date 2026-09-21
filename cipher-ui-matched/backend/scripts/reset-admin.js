import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { query, pool } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const schemaPath = path.resolve(__dirname, '../schema.sql');

const askHidden = (question) => new Promise(resolve => {
  process.stdout.write(question);
  let answer = '';
  const onData = chunk => {
    const ch = chunk.toString();
    if (ch === '\n' || ch === '\r') {
      process.stdin.setRawMode?.(false);
      process.stdin.pause();
      process.stdin.off('data', onData);
      process.stdout.write('\n');
      resolve(answer);
    } else if (ch === '\u0003') {
      process.stdin.setRawMode?.(false);
      process.exit(1);
    } else if (ch === '\u007f') {
      answer = answer.slice(0, -1);
    } else { answer += ch; }
  };
  process.stdin.setRawMode?.(true);
  process.stdin.resume();
  process.stdin.on('data', onData);
});

try {
  await query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await query(fs.readFileSync(schemaPath, 'utf8'));
  const existing = await query('SELECT id FROM admins ORDER BY created_at LIMIT 1');
  if (!existing.rowCount) throw new Error('No admin account exists. Run "npm run admin:create" first.');
  const password = await askHidden('Enter NEW admin password (min 8 characters): ');
  const confirm = await askHidden('Confirm NEW admin password: ');
  if (password.length < 8) throw new Error('Password must be at least 8 characters.');
  if (password !== confirm) throw new Error('Passwords do not match.');
  const hash = await bcrypt.hash(password, 12);
  await query('UPDATE admins SET password_hash=$1 WHERE id=$2', [hash, existing.rows[0].id]);
  console.log('Admin password reset successfully in PostgreSQL.');
} catch (err) {
  console.error('Admin password reset failed:', err.message);
  process.exitCode = 1;
} finally { await pool.end(); }
