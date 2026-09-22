import { useRef } from 'react';

// Horizontal swipe for touch screens: onLeft() = swipe left (next), onRight() = swipe right (previous).
export default function useSwipe(onLeft, onRight) {
  const start = useRef(null);
  return {
    onTouchStart: (e) => { const t = e.touches[0]; start.current = { x: t.clientX, y: t.clientY }; },
    onTouchEnd: (e) => {
      const s = start.current;
      if (!s) return;
      start.current = null;
      const t = e.changedTouches[0];
      const dx = t.clientX - s.x, dy = t.clientY - s.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? onLeft : onRight)();
    },
  };
}
