import { useEffect } from 'react';

// Ref-counted page-scroll lock for modals. The original overflow values are
// saved once (by the first modal) and restored only when the LAST modal closes,
// so the page can never get stuck unscrollable after a modal is dismissed.
let locks = 0;
let saved = null;

export default function useBodyLock() {
  useEffect(() => {
    if (locks === 0) {
      saved = { body: document.body.style.overflow, html: document.documentElement.style.overflow };
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    locks += 1;
    return () => {
      locks = Math.max(0, locks - 1);
      if (locks === 0 && saved) {
        document.body.style.overflow = saved.body;
        document.documentElement.style.overflow = saved.html;
        saved = null;
      }
    };
  }, []);
}
