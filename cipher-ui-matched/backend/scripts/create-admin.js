import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { query, pool } from '../db.js';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../schema.sql');

const ask = (question, hidden = false) => new Promise(resolve => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  if (!hidden) {
    rl.question(question, answer => { rl.close(); resolve(answer); });
    return;
  }
  process.stdout.write(question);
  const stdin = process.stdin;
  const onData = ch => {
    ch = ch.toString();
    if (ch === '\n' || ch === '\r') {
      stdin.setRawMode?.(false);
      stdin.pause();
      stdin.off('data', onData);
      process.stdout.write('\n');
      rl.close();
      resolve(answer);
    } else if (ch === '\u0003') {
      stdin.setRawMode?.(false);
      process.exit(1);
    } else if (ch === '\u007f') {
      answer = answer.slice(0, -1);
    } else {
      answer += ch;
    }
  };
  let answer = '';
  stdin.setRawMode?.(true);
  stdin.resume();
  stdin.on('data', onData);
});

try {
  await query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await query(fs.readFileSync(schemaPath, 'utf8'));

  const existing = await query('SELECT id FROM admins LIMIT 1');
  if (existing.rowCount) {
    console.log('An admin account already exists. No new password was created.');
    process.exitCode = 0;
  } else {
    const password = await ask('Create admin password (min 8 characters): ', true);
    const confirm = await ask('Confirm admin password: ', true);
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    if (password !== confirm) throw new Error('Passwords do not match.');

    const hash = await bcrypt.hash(password, 12);
    await query('INSERT INTO admins(password_hash) VALUES($1)', [hash]);
    console.log('Admin account created in PostgreSQL. The plaintext password was not stored.');
  }
} catch (err) {
  console.error('Admin setup failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
