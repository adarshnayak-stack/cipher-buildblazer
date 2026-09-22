import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadContent, fetchContent } from '../data/contentStore';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchContent().then(data => { if (alive) setContent(data); })
      .catch(err => console.error('Could not load backend content:', err))
      .finally(() => { if (alive) setLoading(false); });
    const refresh = () => fetchContent().then(data => setContent(data)).catch(console.error);
    window.addEventListener('cipher-cms-updated', refresh);
    return () => {
      alive = false;
      window.removeEventListener('cipher-cms-updated', refresh);
    };
  }, []);

  const value = useMemo(() => ({ content, setContent, loading }), [content, loading]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error('useContent must be used inside ContentProvider');
  return value;
}
