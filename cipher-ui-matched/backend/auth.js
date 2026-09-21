import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from './db.js';

const secret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return process.env.JWT_SECRET;
};

export const signAdminToken = (adminId) =>
  jwt.sign({ sub: adminId, role: 'admin' }, secret(), { expiresIn: '12h' });

export function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    req.admin = jwt.verify(token, secret());
    if (req.admin.role !== 'admin') throw new Error('Forbidden');
    next();
  } catch {
    res.status(401).json({ error: 'Admin authentication required.' });
  }
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const r = await query('SELECT id,password_hash FROM admins ORDER BY created_at LIMIT 1');
  if (!r.rowCount) return { ok: false, reason: 'Admin account does not exist.' };
  const valid = await bcrypt.compare(currentPassword, r.rows[0].password_hash);
  if (!valid) return { ok: false, reason: 'Current password is incorrect.' };
  const hash = await bcrypt.hash(newPassword, 12);
  await query('UPDATE admins SET password_hash=$1 WHERE id=$2', [hash, r.rows[0].id]);
  return { ok: true };
}

export async function verifyAdmin(password) {
  const r = await query('SELECT id,password_hash FROM admins ORDER BY created_at LIMIT 1');
  if (!r.rowCount || !(await bcrypt.compare(password, r.rows[0].password_hash))) return null;
  return r.rows[0].id;
}
