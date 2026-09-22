// src/components/IntroLoader.jsx
import React, { useState, useEffect } from 'react';

export default function IntroLoader({ onFinish }) {
  const [step, setStep] = useState(0);
  const [glyphState, setGlyphState] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 60);
    const t2 = setTimeout(() => setStep(2), 240);
    const t3 = setTimeout(() => setStep(3), 440);
    const t4 = setTimeout(() => setStep(4), 640);
    const t5 = setTimeout(() => setStep(5), 840);
    const t6 = setTimeout(() => setGlyphState('Φ     E'), 1200);
    const t7 = setTimeout(() => setGlyphState('C  I  P'), 1950);
    const t8 = setTimeout(() => setGlyphState('C  I  P  H  E'), 2700);
    const t9 = setTimeout(() => setGlyphState('C  I  P  H  E  R'), 3450);
    const t10 = setTimeout(() => onFinish(), 4300);
    return () => [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10].forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#010502] flex flex-col justify-between p-8 font-mono select-none">
      <div />
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center justify-center min-h-[300px]">
        {!glyphState ? (
          <div className="w-full max-w-lg space-y-2 text-[#00ff41] text-sm md:text-base font-mono">
            {step >= 1 && <p>&gt; establishing connection...</p>}
            {step >= 2 && <p>&gt; authenticating access...</p>}
            {step >= 3 && <p>&gt; decrypting CIPHER_v1.0...</p>}
            {step >= 4 && <p>&gt; loading modules... [=========] 100%</p>}
            {step >= 5 && <p className="font-bold text-[#39ff14]">&gt; access granted</p>}
          </div>
        ) : (
          <div className="flex items-center justify-center relative">
            <h1 style={{ fontFamily: '"Metamorphous", "Cinzel Decorative", "Times New Roman", Georgia, serif' }} className="text-6xl sm:text-8xl md:text-9xl font-black text-[#00ff41] tracking-[0.22em] text-center drop-shadow-[0_0_25px_#00ff41]">
              {glyphState}
            </h1>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button onClick={onFinish} className="text-xs tracking-widest border border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41] hover:text-black px-4 py-1.5 transition cursor-pointer">
          [ SKIP &gt; ]
        </button>
      </div>
    </div>
  );
}