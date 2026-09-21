



// src/components/TeamCard.jsx
import React from 'react';
export default function TeamCard({ leader, onClick }) {
  return (
    <div onClick={onClick} className="cyber-card min-w-[270px] sm:min-w-[290px] rounded-lg overflow-hidden group cursor-pointer border border-[#00ff41]/30 hover:border-[#00ff41] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all duration-300 shrink-0">
      <div className="h-72 relative overflow-hidden bg-[#030d06]">
        <img src={leader.image} alt={leader.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
      </div>
      <div className="p-4 text-center border-t border-[#00ff41]/20 bg-[#020b05]">
        <span className="text-[10px] font-mono text-[#00ff41] tracking-widest uppercase font-bold">{leader.role}</span>
        <h3 className="text-base font-bold text-white mt-1">{leader.name}</h3>
      </div>
    </div>
  );
}