import { apiPost, apiGet } from '../data/api';

const TOKEN_KEY = 'cipher_admin_token_v3';

export async function loginAdmin(password) {
  if (!password || password.length < 8) throw new Error('Use at least 8 characters.');
  const data = await apiPost('/api/auth/login', { password });
  localStorage.setItem(TOKEN_KEY, data.token);
  return true;
}

export function isAdminAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export async function validateAdminSession() {
  if (!isAdminAuthenticated()) return false;
  try { await apiGet('/api/auth/me'); return true; }
  catch { logoutAdmin(); return false; }
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY);
}
