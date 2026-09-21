import React, { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth * 0.85);
    let height = (canvas.height = 240);

    // Render "CIPHER" into offscreen canvas to sample dot positions
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCanvas.width = width;
    offCanvas.height = height;

    const fontSize = Math.min(width / 5.2, 140);
    offCtx.font = `900 ${fontSize}px 'JetBrains Mono', monospace`;
    offCtx.fillStyle = '#ffffff';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText('CIPHER', width / 2, height / 2);

    const imgData = offCtx.getImageData(0, 0, width, height).data;
    const particles = [];
    const step = 6;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        if (imgData[index] > 128) {
          particles.push({
            origX: x,
            origY: y,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            baseAlpha: 0.6 + Math.random() * 0.4
          });
        }
      }
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    const render = () => {
      time += 0.04;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Gentle undulating wave
        const wave = Math.sin(time + p.origX * 0.02) * 4;
        const dx = mouse.x - p.x;
        const dy = mouse.y - (p.origY + wave);
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Dispersal interaction on mouse hover
        if (dist < 80) {
          const angle = Math.atan2(dy, dx);
          const force = (80 - dist) / 80;
          p.x -= Math.cos(angle) * force * 7;
          p.y -= Math.sin(angle) * force * 7;
        } else {
          p.x += (p.origX - p.x) * 0.1;
          p.y += (p.origY + wave - p.y) * 0.1;
        }

        ctx.fillStyle = `rgba(0, 255, 102, ${p.baseAlpha})`;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth * 0.85;
      height = canvas.height = 240;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ width: '100%', overflow: 'hidden', margin: '2rem 0 1rem 0' }}>
      <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} />
    </div>
  );
}