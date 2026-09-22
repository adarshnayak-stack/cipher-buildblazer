import React from 'react';
import { Mail } from 'lucide-react';
import { GithubIcon, InstagramIcon, LinkedinIcon } from './BrandIcons';

export default function Footer() {
  return (
    <footer className="border-t border-[#00ff41]/25 py-12 px-6 font-mono text-xs relative z-10 bg-[#010603]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

        <div className="space-y-1.5 text-center md:text-left">
          <div className="text-lg font-black text-[#00ff41] tracking-widest">
            CIPHER
          </div>

          <p className="text-[#00ff41]/75 text-xs">
            Student Association • Computer Science & Engineering
          </p>
        </div>

        <div className="text-[#00ff41]/50 text-xs text-center">
          &gt; © 2026 CIPHER SJEC.
        </div>

        <div className="flex items-center space-x-4 text-[#00ff41]">

          <a
            href="mailto:cipher@sjec.ac.in"
            className="w-10 h-10 rounded-full border border-[#00ff41]/40 bg-[#03200e]/40 flex items-center justify-center hover:text-white transition"
          >
            <Mail className="w-4 h-4" />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full border border-[#00ff41]/40 bg-[#03200e]/40 flex items-center justify-center hover:text-white transition"
          >
            <LinkedinIcon size={16} />
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full border border-[#00ff41]/40 bg-[#03200e]/40 flex items-center justify-center hover:text-white transition"
          >
            <GithubIcon size={16} />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full border border-[#00ff41]/40 bg-[#03200e]/40 flex items-center justify-center hover:text-white transition"
          >
            <InstagramIcon size={16} />
          </a>

        </div>
      </div>
    </footer>
  );
}