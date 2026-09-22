// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onJoinClick }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#020603]/85 backdrop-blur-md border-b border-[#00ff41]/25">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 border border-[#00ff41] rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(0,255,65,0.4)]">
            <span className="text-xs text-[#00ff41] font-bold">⚡</span>
          </div>
          <span className="font-mono font-black tracking-widest text-[#00ff41] text-lg drop-shadow-[0_0_10px_#00ff41]">CIPHER</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8 font-mono text-xs tracking-wider text-[#dcfce7]/75">
          <Link to="/" className="hover:text-[#00ff41] transition">HOME</Link>
          <Link to="/about" className="hover:text-[#00ff41] transition">ABOUT</Link>
          <Link to="/events" className="hover:text-[#00ff41] transition">EVENTS</Link>
          <Link to="/team" className="hover:text-[#00ff41] transition">TEAM</Link>
          <Link to="/contact" className="hover:text-[#00ff41] transition">CONTACT</Link>
          <Link to="/admin" className="text-[#39ff14] font-bold hover:underline">ADMIN CMS</Link>
        </nav>
        <button onClick={onJoinClick} className="font-mono text-xs tracking-widest border-2 border-[#00ff41] text-[#00ff41] px-5 py-2 font-bold hover:bg-[#00ff41] hover:text-black transition shadow-[0_0_20px_rgba(0,255,65,0.45)] cursor-pointer">
          JOIN CIPHER
        </button>
      </div>
    </header>
  );
}