const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export const apiUrl = (path) => `${API_BASE}${path}`;

export function getToken() {
  return localStorage.getItem('cipher_admin_token_v3') || '';
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(apiUrl(path), { ...options, headers });
  const type = res.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) throw new Error(data?.error || data || `Request failed (${res.status})`);
  return data;
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) });
export const apiDelete = (path) => request(path, { method: 'DELETE' });
export const apiPatch = (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) });

export async function uploadMedia(file, kind = 'image') {
  const form = new FormData();
  form.append('file', file);
  return request(`/api/uploads/${kind}`, { method: 'POST', body: form });
}
