import React, { useEffect, useRef } from 'react';

export default function ReticleCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const target = useRef({
    x: -100,
    y: -100
  });

  const current = useRef({
    x: -100,
    y: -100
  });

  useEffect(() => {
    const move = (event) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
    };

    const leave = () => {
      target.current.x = -100;
      target.current.y = -100;
    };

    window.addEventListener('mousemove', move, {
      passive: true
    });

    window.addEventListener('mouseleave', leave);

    let raf = 0;

    const render = () => {
      current.current.x +=
        (target.current.x - current.current.x) * 0.25;

      current.current.y +=
        (target.current.y - current.current.y) * 0.25;

      const x = current.current.x;
      const y = current.current.y;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${x - 15}px, ${y - 15}px, 0)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${target.current.x - 2}px, ${target.current.y - 2}px, 0)`;
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
      />

      <div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden="true"
      />
    </>
  );
}
