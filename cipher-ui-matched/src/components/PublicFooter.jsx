import React from 'react';
import { Mail } from 'lucide-react';
import { GithubIcon, InstagramIcon, LinkedinIcon } from './BrandIcons';
import { useContent } from '../context/ContentContext';

export default function PublicFooter() {
  const { content } = useContent();
  const c = content.site.contact || {};
  const s = c.socials || {};
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <h3>CIPHER</h3>
          <p>Student Association · Computer Science &amp; Engineering</p>
        </div>
        <div className="footer-socials">
          <a href={`mailto:${c.email || 'cipher@sjec.ac.in'}`} aria-label="Email"><Mail size={19} /></a>
          <a href={s.linkedin || 'https://www.linkedin.com/'} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={19} /></a>
          <a href={s.github || 'https://github.com/'} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={19} /></a>
          <a href={s.instagram || 'https://www.instagram.com/'} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon size={19} /></a>
        </div>
      </div>
      <div className="footer-bottom">&gt; © 2026 CIPHER SJEC.</div>
    </footer>
  );
}
