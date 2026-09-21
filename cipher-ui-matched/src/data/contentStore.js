import { eventsData as defaultEvents } from './events';
import { teamData as defaultTeam } from './team';
import { siteContent as defaultSiteContent } from './siteContent';
import { apiGet, apiPut } from './api';

const clone = (value) => (value === undefined ? value : JSON.parse(JSON.stringify(value)));

export const defaultContent = {
  events: clone(defaultEvents),
  team: clone(defaultTeam),
  site: clone(defaultSiteContent),
};

export function loadContent() {
  return clone(defaultContent);
}

export async function fetchContent() {
  const data = await apiGet('/api/content');
  return data;
}

export async function saveContent(content) {
  const saved = await apiPut('/api/content', content);
  window.dispatchEvent(new CustomEvent('cipher-cms-updated'));
  return saved;
}

export function resetContent() {
  return saveContent(clone(defaultContent));
}

export const getEvents = () => fetchContent().then(x => x.events);
export const getTeam = () => fetchContent().then(x => x.team);
export const saveEvents = (events) => fetchContent().then(c => saveContent({ ...c, events }));
export const saveTeam = (team) => fetchContent().then(c => saveContent({ ...c, team }));

// Kept for compatibility with the old CMS buttons.
export function exportContentFile(content) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `cipher-content-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
}

export async function importContentFile(file) {
  const parsed = JSON.parse(await file.text());
  if (!Array.isArray(parsed.events) || !parsed.team || !parsed.site) throw new Error('Invalid CIPHER content file.');
  await saveContent(parsed);
  return parsed;
}
