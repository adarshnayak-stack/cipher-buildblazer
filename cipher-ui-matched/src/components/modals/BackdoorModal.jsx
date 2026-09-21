// src/components/modals/BackdoorModal.jsx
import React from 'react';
export default function BackdoorModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="cyber-card w-full max-w-lg p-8 rounded-lg border-2 border-[#00ff41] shadow-[0_0_50px_#00ff41] font-mono text-center space-y-4">
        <div className="text-4xl text-[#00ff41] font-black tracking-widest">ROOT ACCESS</div>
        <p className="text-xs text-[#dcfce7]/90 leading-relaxed">&gt; You found the backdoor. Welcome to the inner circle of CIPHER.</p>
        <button onClick={onClose} className="border-2 border-[#00ff41] text-[#00ff41] px-6 py-2 text-xs font-bold hover:bg-[#00ff41] hover:text-black transition cursor-pointer">[ CLOSE CONNECTION ]</button>
      </div>
    </div>
  );
}