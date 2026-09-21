import React, { useEffect, useRef } from 'react';

export default function MatrixRain({ opacity = 0.18, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let columns = [];
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZΦΞΨΩλπ<>[]{}#$%&*+-/';
    const fontSize = 13;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Array.from({ length: Math.ceil(width / fontSize) + 1 }, () => ({
        y: Math.random() * height,
        speed: 0.45 + Math.random() * 1.15,
        length: 4 + Math.floor(Math.random() * 14),
      }));
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(1, 4, 2, 0.12)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      columns.forEach((column, i) => {
        const x = i * fontSize;
        for (let j = 0; j < column.length; j += 1) {
          const y = column.y - j * fontSize;
          if (y < -fontSize || y > height + fontSize) continue;
          const alpha = Math.max(0.02, 0.42 - j * 0.027);
          ctx.fillStyle = `rgba(0,255,90,${alpha})`;
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);
        }
        column.y += column.speed;
        if (column.y - column.length * fontSize > height && Math.random() > 0.975) {
          column.y = -Math.random() * height * 0.2;
          column.speed = 0.45 + Math.random() * 1.15;
        }
      });

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

  return <canvas ref={canvasRef} className={`matrix-rain ${className}`} style={{ opacity }} aria-hidden="true" />;
}
