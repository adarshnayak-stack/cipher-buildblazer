// src/components/modals/GalleryModal.jsx
import React, { useState, useRef } from 'react';

export default function GalleryModal({ galleryData, onClose }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const lastXRef = useRef(null);
  const accumMoveRef = useRef(0);
  const total = galleryData.images.length;

  const handleMouseMove = (e) => {
    if (lastXRef.current === null) {
      lastXRef.current = e.clientX;
      return;
    }
    const delta = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    accumMoveRef.current += delta;

    if (accumMoveRef.current > 95) {
      accumMoveRef.current = 0;
      setSlideIndex(p => (p + 1) % total);
    } else if (accumMoveRef.current < -95) {
      accumMoveRef.current = 0;
      setSlideIndex(p => (p - 1 + total) % total);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="cyber-card w-full max-w-5xl p-6 sm:p-8 rounded-xl border-2 border-[#00ff41] shadow-[0_0_40px_rgba(0,255,65,0.45)] font-mono">
        <div className="flex justify-between items-start border-b border-[#00ff41]/25 pb-4 mb-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">{galleryData.title}</h3>
            <span className="text-xs text-[#00ff41]/75 tracking-wider block mt-1">{galleryData.subDate}</span>
          </div>
          <button onClick={onClose} className="text-[#00ff41] border border-[#00ff41]/50 px-3 py-1 rounded text-xs cursor-pointer">[x]</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 text-xs sm:text-sm text-[#dcfce7]/85 leading-relaxed">
            <p>{galleryData.desc}</p>
          </div>
          <div className="lg:col-span-7 flex flex-col items-center space-y-4">
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { lastXRef.current = null; accumMoveRef.current = 0; }}
              className="gallery-slider-viewport w-full max-w-md h-80 sm:h-96 border-2 border-[#00ff41] rounded-lg relative bg-[#020b05] cursor-ew-resize overflow-hidden"
            >
              <div style={{ transform: `translateX(-${slideIndex * 100}%)` }} className="gallery-track-filmstrip flex h-full transition-transform duration-300 ease-out">
                {galleryData.images.map((img, i) => (
                  <div key={i} className="gallery-slide-card shrink-0 w-full h-full">
                    <img src={img} alt="" className="w-full h-full object-cover pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full max-w-md flex items-center justify-between px-2 text-[#00ff41] text-xs font-mono">
              <button onClick={() => setSlideIndex(p => (p - 1 + total) % total)} className="w-9 h-9 border border-[#00ff41]/50 rounded flex items-center justify-center cursor-pointer">←</button>
              <span className="text-sm font-bold text-[#00ff41]">{(slideIndex + 1).toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}</span>
              <button onClick={() => setSlideIndex(p => (p + 1) % total)} className="w-9 h-9 border border-[#00ff41]/50 rounded flex items-center justify-center cursor-pointer">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}