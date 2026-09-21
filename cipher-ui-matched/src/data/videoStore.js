import { uploadMedia, apiUrl, getToken } from './api';

export async function putVideo(id, blob) {
  const result = await uploadMedia(blob, 'video');
  return result;
}

export async function getVideo(idOrUrl) {
  if (!idOrUrl) return null;
  const url = String(idOrUrl).startsWith('http') ? idOrUrl : apiUrl(`/api/uploads/${idOrUrl}`);
  const res = await fetch(url, { headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {} });
  if (!res.ok) return null;
  return res.blob();
}

export async function deleteVideo() { return true; }
export async function listVideoIds() { return []; }
