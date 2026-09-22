import { useEffect, useState } from 'react';
import { apiGet, apiPost, getToken, apiDelete, apiPatch } from './api';

const EVENT = 'cipher-join-updated';
let cache = [];

export async function getJoinRequests() {
  if (!getToken()) return [];
  cache = await apiGet('/api/join-requests');
  return cache;
}

export async function addJoinRequest(data) {
  const request = await apiPost('/api/join-requests', data);
  window.dispatchEvent(new CustomEvent(EVENT));
  return request;
}

export async function markJoinRequest(id, status) {
  const result = await apiPatch(`/api/join-requests/${id}/status`, { status });
  window.dispatchEvent(new CustomEvent(EVENT));
  return result;
}

export async function markAllJoinRequestsRead() {
  await apiPost('/api/join-requests/mark-all-read', {});
  window.dispatchEvent(new CustomEvent(EVENT));
}

export async function deleteJoinRequest(id) {
  await apiDelete(`/api/join-requests/${id}`);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useJoinRequests() {
  const [requests, setRequests] = useState(cache);
  useEffect(() => {
    let alive = true;
    const refresh = () => getJoinRequests().then(x => alive && setRequests(x)).catch(() => alive && setRequests([]));
    refresh();
    window.addEventListener(EVENT, refresh);
    const timer = setInterval(refresh, 30000);
    return () => { alive = false; window.removeEventListener(EVENT, refresh); clearInterval(timer); };
  }, []);
  return requests;
}
