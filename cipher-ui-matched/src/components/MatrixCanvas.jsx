// src/components/MatrixCanvas.jsx
import React, { useEffect, useRef } from 'react';

export default function MatrixCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = '0123456789ABCDEFΦΞΨΩλπ01@#%&*+-/<>';
    const fontSize = 14;
    const cols = Math.floor(width / fontSize);
    const drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 3, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const timer = setInterval(draw, 35);
    const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { clearInterval(timer); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none opacity-25 z-0" />;
}