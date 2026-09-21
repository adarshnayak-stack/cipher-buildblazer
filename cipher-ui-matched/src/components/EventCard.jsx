// src/components/EventCard.jsx
import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

export default function EventCard({ event, onClick }) {
  const isGala = event.category === 'BRANCH GALA';
  return (
    <div onClick={onClick} className="cyber-card p-6 rounded-lg space-y-4 cursor-pointer group border border-[#00ff41]/25 hover:border-[#00ff41] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all duration-300">
      <div className="flex justify-between items-start font-mono text-xs">
        <span className="text-[#00ff41] flex items-center gap-1.5">{isGala ? <Sparkles className="w-4 h-4" /> : <Terminal className="w-4 h-4" />} {event.category}</span>
        <span className="text-[#00ff41]/70 font-mono">{event.date}</span>
      </div>
      <h3 className="text-2xl font-bold text-white group-hover:text-[#00ff41] transition-colors">{event.title}</h3>
      <p className="font-mono text-xs text-[#dcfce7]/75 leading-relaxed">{event.desc}</p>
      <div className="font-mono text-xs text-[#00ff41] flex items-center space-x-2 pt-2 font-bold">
        <span>VIEW GALLERY</span>
        <span className="group-hover:translate-x-1.5 transition-transform">&gt;</span>
      </div>
    </div>
  );
}