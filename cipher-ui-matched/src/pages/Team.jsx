import useBodyLock from '../hooks/useBodyLock';
import useHoverPan from '../hooks/useHoverPan';
import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { X } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';
import { useContent } from '../context/ContentContext';

function MemberModal({ member, onClose }) {
  useBodyLock();
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.div className="leader-modal" initial={{ opacity: 0, scale: .84, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .92, y: 20 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }} onClick={e => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18} /></button><img src={member.image} alt={member.name} /><div className="eyebrow">{member.role}</div><h2>{member.name}</h2><p>{member.bio || 'CIPHER core team member contributing to student-led technical activities and community initiatives.'}</p><div className="modal-socials">{member.linkedin && <a href={member.linkedin || 'https://www.linkedin.com/'} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn`} onClick={e => e.stopPropagation()}><LinkedinIcon size={17} /></a>}{member.github && <a href={member.github || 'https://github.com/'} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub`} onClick={e => e.stopPropagation()}><GithubIcon size={17} /></a>}</div></motion.div></motion.div>;
}

export default function Team() {
  const { content } = useContent();
  const leaders = useMemo(() => [...(content.team.officeBearers || []), ...(content.team.coreTeam || [])], [content.team]);
  const page = content.site.leadership || {};
  const [selected, setSelected] = useState(null);
  const panRef = useHoverPan();
  return (
    <div className="page-content">
      <section className="inner-hero section"><div className="eyebrow">{page.eyebrow}</div><h1>{page.heading}</h1><p>{(page.intro || '').replace('{count}', leaders.length)}</p></section>
      <section className="detail-section section">
        <div className="leadership-viewport team-page-track-area" ref={panRef}>
          <div className="leader-track">
            {leaders.map((member, i) => <motion.article key={`${member.id}-${i}`} className="leader-card interactive-card" whileHover={{ y: -10, scale: 1.015 }} onClick={() => setSelected(member)}><div className="leader-photo"><div className="leader-matrix">01<br />ΨΦ<br />10<br />C1</div><img src={member.image} alt={member.name} /></div><div className="leader-info"><span>{member.role}</span><h3>{member.name}</h3><small>{member.year || 'CSE'}</small><div className="leader-links">{member.linkedin && <a href={member.linkedin || 'https://www.linkedin.com/'} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn`}><LinkedinIcon size={14} /></a>}{member.github && <a href={member.github || 'https://github.com/'} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub`}><GithubIcon size={14} /></a>}</div></div></motion.article>)}
          </div>
        </div>
        <div className="carousel-hint">SWIPE (OR MOVE YOUR CURSOR) LEFT / RIGHT TO BROWSE THE LEADERSHIP DECK</div>
      </section>
      <AnimatePresence>{selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </div>
  );
}
