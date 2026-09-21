import { useEffect, useRef } from 'react';

// Attach to the leadership viewport (its first child is the track).
// Mouse / trackpad-cursor devices: the card row glides with the cursor (works
// even when every card already fits on screen). Touch devices: native swipe.
const MOUSE_MODE = '(hover: hover) and (pointer: fine)';
const IDLE_RANGE = 110; // px the row drifts each way when all cards already fit

export default function useHoverPan() {
  const ref = useRef(null);
  useEffect(() => {
    const viewport = ref.current;
    const track = viewport?.firstElementChild;
    if (!viewport || !track) return;
    const zone = viewport.closest('section') || viewport;
    const mq = window.matchMedia(MOUSE_MODE);
    let ratio = 0.5, current = null, raf = 0;

    const targetX = () => {
      const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (overflow > 0) return -ratio * overflow;          // pan across the whole row
      return -(ratio - 0.5) * 2 * IDLE_RANGE;               // gentle drift when it all fits
    };
    const tick = () => {
      const t = targetX();
      if (current === null) current = t;
      current += (t - current) * 0.09;
      track.style.transform = `translate3d(${current.toFixed(2)}px,0,0)`;
      raf = Math.abs(t - current) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      if (!mq.matches || e.pointerType !== 'mouse') return;
      const r = viewport.getBoundingClientRect();
      ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const reset = () => {
      cancelAnimationFrame(raf); raf = 0; current = null;
      track.style.transform = '';
    };

    zone.addEventListener('pointermove', move);
    mq.addEventListener?.('change', reset);
    return () => {
      zone.removeEventListener('pointermove', move);
      mq.removeEventListener?.('change', reset);
      cancelAnimationFrame(raf);
      track.style.transform = '';
    };
  }, []);
  return ref;
}
