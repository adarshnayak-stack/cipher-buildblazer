// An activity is { title, video } where video is null, { type: 'upload', id, name, size } or { type: 'link', url }.
// Older saved content stored activities as plain strings — normalise both shapes.
export const normalizeActivity = (a) =>
  typeof a === 'string' ? { title: a, video: null } : { title: a?.title || '', video: a?.video || null };

export function safeUrl(raw) {
  try {
    const u = new URL(String(raw).trim());
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch { return null; }
}

// YouTube / Vimeo / Google Drive links become embeds; anything else is treated as a direct video file URL.
export function toEmbedUrl(raw) {
  try {
    const u = new URL(raw);
    const h = u.hostname.replace(/^www\./, '');
    if (h === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
    if (h.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') || u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (h === 'vimeo.com') {
      const id = u.pathname.match(/\/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
    if (h === 'drive.google.com') {
      const id = u.pathname.match(/\/file\/d\/([\w-]+)/)?.[1];
      return id ? `https://drive.google.com/file/d/${id}/preview` : null;
    }
  } catch { /* not a URL */ }
  return null;
}
