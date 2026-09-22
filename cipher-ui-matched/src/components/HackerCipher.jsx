import React, { useEffect, useRef } from 'react';

const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ0123456789CIPHER<>/\\|=+*#$%&';
const rnd = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/* Falling / hacking-character reveal of the word CIPHER.
   Streams of glyphs fall column by column and lock into the letter shapes. */
export default function HackerCipher({ start = true, text = 'CIPHER' }) {
  const canvasRef = useRef(null);
  const startRef = useRef(start);
  const t0Ref = useRef(null);

  useEffect(() => {
    startRef.current = start;
    if (start && t0Ref.current === null) t0Ref.current = performance.now();
  }, [start]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, cw = 10, ch = 13, cols = 0, rows = 0;
    let mask = [], glyph = [], colState = [], offX = [], offY = [];
    let raf = 0, alive = true;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const parent = canvas.parentElement;
      W = Math.max(320, Math.floor(parent?.getBoundingClientRect().width || window.innerWidth - 54));
      H = Math.round(Math.min(Math.max(W * 0.3, 190), 470));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 1. draw the word wide & huge on an offscreen canvas to use as a mask
      const off = document.createElement('canvas');
      off.width = W; off.height = H;
      const o = off.getContext('2d', { willReadFrequently: true });
      const fs = H * 0.98;
      o.font = `800 ${fs}px "JetBrains Mono", monospace`;
      o.textAlign = 'center'; o.textBaseline = 'middle';
      o.fillStyle = '#fff'; o.strokeStyle = '#fff'; o.lineWidth = fs * 0.05;
      const slot = W / text.length;
      [...text].forEach((letter, i) => {
        const m = o.measureText(letter).width;
        const sx = (slot * 0.9) / Math.max(m, 1);
        o.save();
        o.translate(slot * i + slot / 2, H / 2 + fs * 0.04);
        o.scale(sx, 1);
        o.fillText(letter, 0, 0);
        o.strokeText(letter, 0, 0);
        o.restore();
      });
      const px = o.getImageData(0, 0, W, H).data;

      // 2. sample into a character grid
      cw = Math.max(9, Math.min(15, W / 105));
      ch = cw * 1.3;
      cols = Math.floor(W / cw); rows = Math.floor(H / ch);
      mask = []; glyph = []; colState = []; offX = []; offY = [];
      for (let c = 0; c < cols; c++) {
        mask[c] = []; glyph[c] = []; offX[c] = []; offY[c] = [];
        for (let r = 0; r < rows; r++) {
          const x = Math.floor(c * cw + cw / 2), y = Math.floor(r * ch + ch / 2);
          mask[c][r] = px[(y * W + x) * 4 + 3] > 110;
          glyph[c][r] = rnd();
          offX[c][r] = 0; offY[c][r] = 0;
        }
        colState[c] = {
          delay: (c / cols) * 1.1 + Math.random() * 1.3,   // stagger over ~2.4s
          speed: 15 + Math.random() * 11,                    // rows per second
          trail: 7 + Math.floor(Math.random() * 10),
        };
      }
    };

    const frame = (now) => {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, W, H);
      if (!startRef.current && !reduce) return;
      if (t0Ref.current === null) t0Ref.current = now;
      const t = reduce ? 99 : (now - t0Ref.current) / 1000;
      ctx.font = `700 ${ch * 0.92}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      for (let c = 0; c < cols; c++) {
        const s = colState[c];
        const head = Math.floor((t - s.delay) * s.speed);
        if (head < 0) continue;
        const cx = c * cw + cw / 2;
        for (let r = 0; r < rows; r++) {
          const cy = r * ch + ch / 2;
          const m = mask[c][r];
          const behind = head - r; // >=0 means the stream has passed this row
          let a = 0, color = '0,255,90';

          if (m && behind >= 0) {
            // locked letter cell: flash on arrival, then settle & shimmer
            const fresh = Math.max(0, 1 - behind / 14);
            a = 0.78 + 0.16 * Math.sin(t * 2 + c * 0.7 + r) + fresh * 0.25;
            if (behind === 0) { color = '225,255,235'; a = 1; }
            else if (fresh > 0.5) color = '150,255,190';
            if (behind < 8 || Math.random() < 0.012) glyph[c][r] = rnd();
          } else if (!m && behind >= 0 && behind < s.trail) {
            a = (1 - behind / s.trail) * 0.6;
            if (behind === 0) { color = '190,255,210'; a = 0.95; }
            glyph[c][r] = Math.random() < 0.3 ? rnd() : glyph[c][r];
          } else if (m && behind < 0 && behind > -3) {
            continue;
          }
          if (a <= 0.02) continue;

          // mouse: push glyphs away from the cursor, and scramble + brighten them
          const radius = 130;
          const d = Math.hypot(cx - mouse.x, cy - mouse.y);
          let tx = 0, ty = 0;
          if (d < radius) {
            const k = 1 - d / radius;
            const ang = Math.atan2(cy - mouse.y, cx - mouse.x);
            tx = Math.cos(ang) * k * 26;
            ty = Math.sin(ang) * k * 26;
            if (m && behind >= 0) {
              a = Math.min(1, a + k * 0.5); color = `${Math.round(120 + 105 * k)},255,${Math.round(160 + 75 * k)}`;
              if (Math.random() < 0.35) glyph[c][r] = rnd();
            }
          }
          offX[c][r] += (tx - offX[c][r]) * 0.25;
          offY[c][r] += (ty - offY[c][r]) * 0.25;

          ctx.fillStyle = `rgba(${color},${Math.min(a, 1)})`;
          ctx.fillText(glyph[c][r], cx + offX[c][r], cy + offY[c][r]);
        }
      }
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    };
    const onResize = () => build();

    (document.fonts?.ready || Promise.resolve()).then(() => {
      if (!alive) return;
      build();
      raf = requestAnimationFrame(frame);
    });
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [text]);

  return <canvas ref={canvasRef} className="hacker-cipher" aria-label={text} role="img" />;
}
