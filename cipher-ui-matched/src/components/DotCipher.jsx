import React, { useEffect, useRef } from 'react';

export default function DotCipher() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');
    let width = 0;
    let height = 300;
    let dpr = 1;
    let particles = [];
    let raf = 0;
    let mouse = { x: -9999, y: -9999 };
    let time = 0;

    const build = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = Math.max(320, rect?.width || window.innerWidth * 0.84);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      off.width = Math.floor(width);
      off.height = height;
      offCtx.clearRect(0, 0, width, height);
      const fontSize = Math.min(width / 4.55, 205);
      offCtx.font = `900 ${fontSize}px JetBrains Mono, monospace`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#fff';
      offCtx.fillText('CIPHER', width / 2, height / 2 + 8);
      const data = offCtx.getImageData(0, 0, Math.floor(width), height).data;
      particles = [];
      const step = width < 700 ? 7 : 6;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * Math.floor(width) + x) * 4;
          if (data[index] > 120) {
            particles.push({
              ox: x,
              oy: y,
              x,
              y,
              phase: Math.random() * Math.PI * 2,
              alpha: 0.28 + Math.random() * 0.72,
            });
          }
        }
      }
    };

    const onMouse = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const draw = () => {
      time += 0.035;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        const wave = Math.sin(time * 1.3 + p.ox * 0.021 + p.phase) * 5;
        const tx = p.ox;
        const ty = p.oy + wave;
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 90) {
          const force = (90 - distance) / 90;
          p.x += (-dx / Math.max(distance, 1)) * force * 8;
          p.y += (-dy / Math.max(distance, 1)) * force * 8;
        } else {
          p.x += (tx - p.x) * 0.085;
          p.y += (ty - p.y) * 0.085;
        }
        ctx.fillStyle = `rgba(0,255,90,${p.alpha})`;
        ctx.fillRect(p.x, p.y, 2.3, 2.3);
      });
      raf = requestAnimationFrame(draw);
    };

    build();
    window.addEventListener('resize', build);
    window.addEventListener('mousemove', onMouse, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-cipher" aria-label="CIPHER" />;
}
