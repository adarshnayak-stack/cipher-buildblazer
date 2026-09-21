import React, { useEffect, useRef } from 'react';

export default function TopographicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let lastFrame = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time) => {
      // 30 FPS is enough for this background animation
      if (time - lastFrame < 33) {
        raf = requestAnimationFrame(draw);
        return;
      }

      lastFrame = time;

      const t = time * 0.00035;

      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0,255,90,.34)';

      // dense, evenly spaced vertical strips (~25px on a 1920px screen)
      const spacing = Math.max(14, Math.min(26, w / 76));

      // slow-drifting "lens" bulges that push the strips apart (the round swells in the reference)
      const bumps = [
        { cx: w * (0.72 + 0.10 * Math.sin(t * 0.9)), cy: h * (0.35 + 0.12 * Math.cos(t * 0.7)), sigma: Math.max(140, w * 0.09), push: 0.55 },
        { cx: w * (0.22 + 0.08 * Math.cos(t * 0.6)), cy: h * (0.70 + 0.10 * Math.sin(t * 0.8)), sigma: Math.max(120, w * 0.075), push: -0.45 },
        { cx: w * (0.50 + 0.15 * Math.sin(t * 0.5 + 2)), cy: h * (0.90 + 0.06 * Math.cos(t)), sigma: Math.max(160, w * 0.10), push: 0.4 },
      ];

      for (let base = -spacing * 2; base < w + spacing * 2; base += spacing) {
        ctx.beginPath();

        for (let y = -20; y <= h + 20; y += 18) {
          // large flowing wave
          let x = base +
            Math.sin(y * 0.006 + base * 0.010 + t * 1.5) * 30 +
            Math.sin(y * 0.013 - base * 0.004 - t) * 12 +
            Math.sin(y * 0.0025 + base * 0.005 + t * 0.7) * 24;

          // bulges
          for (const b of bumps) {
            const dx = base - b.cx;
            const dy = y - b.cy;
            x += dx * b.push * Math.exp(-(dx * dx + dy * dy) / (2 * b.sigma * b.sigma));
          }

          if (y === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();

    window.addEventListener('resize', resize);

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="topo-canvas"
      aria-hidden="true"
    />
  );
}