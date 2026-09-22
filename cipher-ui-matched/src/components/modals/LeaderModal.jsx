// src/components/modals/LeaderModal.jsx
import React from 'react';
import { GithubIcon, LinkedinIcon } from '../BrandIcons';

export default function LeaderModal({ leader, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="cyber-card w-full max-w-[340px] sm:max-w-[380px] rounded-xl relative overflow-hidden border-2 border-[#00ff41] shadow-[0_0_40px_rgba(0,255,65,0.45)] font-mono">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 text-[#00ff41] bg-black/70 px-2 py-0.5 rounded border border-[#00ff41]/50 cursor-pointer"
        >
          [x]
        </button>

        <div className="h-96 relative bg-[#020b05] overflow-hidden">
          <img
            src={leader.image}
            alt={leader.name}
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="p-6 text-center -mt-6 relative z-30 bg-[#020703] border-t border-[#00ff41]/30">

          <span className="text-xs text-[#00ff41] tracking-widest uppercase font-bold block mb-1">
            {leader.role}
          </span>

          <h3 className="text-xl font-bold text-white mb-3">
            {leader.name}
          </h3>

          <div className="flex justify-center items-center space-x-6 text-[#00ff41]">

            <a
              href={leader.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded border border-[#00ff41]/40 transition"
            >
              <GithubIcon size={20} />
            </a>

            <a
              href={leader.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded border border-[#00ff41]/40 transition"
            >
              <LinkedinIcon size={20} />
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}