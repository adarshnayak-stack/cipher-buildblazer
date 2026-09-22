import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight,
  Code2, Crown, Mail, Rocket, Users, X
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import JoinForm from './components/JoinForm';
import useBodyLock from './hooks/useBodyLock';
import useHoverPan from './hooks/useHoverPan';
import useSwipe from './hooks/useSwipe';
import JoinRequests from './admin/JoinRequests';
import { GithubIcon, InstagramIcon, LinkedinIcon } from './components/BrandIcons';
import MatrixRain from './components/MatrixRain';
import HackerCipher from './components/HackerCipher';
import ReticleCursor from './components/ReticleCursor';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import TopographicBackground from './components/TopographicBackground';
import About from './pages/About';
import Events from './pages/Events';
import Team from './pages/Team';
import Contact from './pages/Contact';
import PageShell from './components/PageShell';
import { ContentProvider, useContent } from './context/ContentContext';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/Dashboard';
import AdminLogin from './admin/Login';
import ManageEvents from './admin/ManageEvents';
import ManageTeam from './admin/ManageTeam';
import SiteContent from './admin/SiteContent';
import ManageAbout from './admin/ManageAbout';
import Security from './admin/Security';
import { getVideo } from './data/videoStore';
import { normalizeActivity, toEmbedUrl, safeUrl } from './data/activities';

const domainIcons = [Code2, Crown, Users, Rocket];

const collageImages = [
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop',
];

function MatrixBoot({ onComplete }) {
  const [step, setStep] = useState(0);
  const [glyph, setGlyph] = useState('');
  useEffect(() => { document.fonts?.load('900 80px "Metamorphous"'); }, []);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 120), setTimeout(() => setStep(2), 480),
      setTimeout(() => setStep(3), 820), setTimeout(() => setStep(4), 1180),
      setTimeout(() => setStep(5), 1540), setTimeout(() => setGlyph('Φ   E'), 2050),
      setTimeout(() => setGlyph('C  1  P'), 2500), setTimeout(() => setGlyph('C  1  P  H  E'), 2950),
      setTimeout(() => setGlyph('C  I  P  H  E  R'), 3400), setTimeout(onComplete, 4300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);
  const lines = ['establishing connection...', 'authenticating access...', 'decrypting CIPHER_v1.0...', 'loading modules... [=========] 100%', 'access granted'];
  return (
    <motion.div className="boot-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .65 }}>
      <MatrixRain opacity={.25} />
      <div className="boot-scanlines" />
      <div className="boot-content">
        {!glyph ? <div className="boot-logs">{lines.map((line, i) => step >= i + 1 && <motion.div key={line} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>&gt; {line}</motion.div>)}</div> : (
          <motion.div key={glyph} className="boot-glyph" initial={{ opacity: 0, scale: .75, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: .35 }}>{glyph}</motion.div>
        )}
      </div>
      <button className="skip-boot" onClick={onComplete}>[ SKIP &gt; ]</button>
    </motion.div>
  );
}

function ScrambleTitle({ text }) {
  const chars = '!@#$%&*+<>?01CIPHER';
  const [value, setValue] = useState(text);
  const run = () => {
    let frame = 0;
    const timer = setInterval(() => {
      frame += 1;
      const settled = Math.floor(frame / 2);
      setValue(text.split('').map((c, i) => i < settled ? c : (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])).join(''));
      if (settled >= text.length) clearInterval(timer);
    }, 45);
  };
  useEffect(run, [text]);
  return <span onMouseEnter={run}>{value}</span>;
}

function Reveal({ children, className = '', delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 38 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .72, delay, ease: [0.16, 1, .3, 1] }}>{children}</motion.div>;
}

function Collage() {
  const hoverImages = [
    '/images/about/IMG_8476.JPG',
    '/images/about/IMG_8492.JPG',
    '/images/about/IMG_8500.JPG',
    '/images/about/IMG_5951.JPG',
    '/images/about/IMG_8523.JPG',
    '/images/about/IMG_5949.JPG', 
    '/images/about/IMG_5950.JPG', 
  ];
  const [hovered, setHovered] = useState(false);
  const [activeImages, setActiveImages] = useState(() => hoverImages.slice(0, 4));
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const lastSwap = useRef(0);
  const letterRefs = useRef([]);

  const lightLetters = (e) => {
    letterRefs.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const k = Math.max(0, 1 - d / 230);
      const p = k * k;
      el.style.color = `rgb(${Math.round(0 + 210 * p)},${Math.round(110 + 145 * p)},${Math.round(45 + 150 * p)})`;
      el.style.textShadow = `0 0 ${6 + 26 * p}px rgba(0,255,90,${0.25 + 0.75 * p}), 0 0 ${20 + 60 * p}px rgba(0,255,90,${0.15 + 0.85 * p}), 0 0 ${60 * p}px rgba(120,255,170,${p}), 0 0 ${130 * p}px rgba(0,255,90,${p * 0.9})`;
      el.style.transform = `translateY(${-10 * p}px) scale(${1 + 0.16 * p})`;
    });
  };
  const resetLetters = () => letterRefs.current.forEach((el) => { if (el) { el.style.color = ''; el.style.textShadow = ''; el.style.transform = ''; } });

  const randomiseOne = () => {
    setActiveImages(current => {
      const used = new Set(current);
      const candidates = hoverImages.filter(src => !used.has(src));
      if (!candidates.length) return current;
      const slot = Math.floor(Math.random() * current.length);
      const next = [...current];
      next[slot] = candidates[Math.floor(Math.random() * candidates.length)];
      return next;
    });
  };

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - .5) * 2;
    setPointer({ x, y });
    const now = performance.now();
    if (now - lastSwap.current > 450) {
      lastSwap.current = now;
      randomiseOne();
    }
  };

  const positions = [
    { x: -112, y: -76, r: -7 }, { x: 108, y: -84, r: 8 },
    { x: -92, y: 78, r: 6 }, { x: 105, y: 76, r: -7 },
  ];

  return (
    <div
      className="about-visual"
      onMouseEnter={() => { setHovered(true); randomiseOne(); }}
      onMouseMove={(e) => { handleMove(e); lightLetters(e); }}
      onMouseLeave={() => { setHovered(false); setPointer({ x: 0, y: 0 }); resetLetters(); }}
    >
      <motion.div className="about-word interactive-card" animate={{ scale: hovered ? 1.055 : 1, x: pointer.x * 5, y: pointer.y * 5 }} transition={{ type: 'spring', stiffness: 180, damping: 16 }}>{'CIPHER'.split('').map((ch, i) => <span key={i} className="about-letter" ref={(el) => (letterRefs.current[i] = el)}>{ch}</span>)}</motion.div>
      <div className="about-glow" />
      {activeImages.map((src, i) => {
        const p = positions[i];
        return (
          <motion.div
            key={`${src}-${i}`}
            className="collage-card"
            initial={{ opacity: 0, scale: .2, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: hovered ? 1 : 0,
              x: hovered ? p.x + pointer.x * (i % 2 ? 12 : -12) : 0,
              y: hovered ? p.y + pointer.y * (i % 2 ? -10 : 10) : 0,
              rotate: hovered ? p.r + pointer.x * (i % 2 ? 2 : -2) : 0,
              scale: hovered ? 1 : .2,
            }}
            transition={{ type: 'spring', stiffness: 95, damping: 20, mass: .8 }}
          >
            <img src={src} alt="CIPHER activity" />
            <span className="collage-index">// 0{i + 1}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function LeadershipCarousel({ leaders, onSelect }) {
  const viewportRef = useHoverPan();
  return (
    <div className="leadership-viewport" ref={viewportRef}>
      <div className="leader-track">
        {leaders.map((member) => <LeaderCard key={member.id} member={member} onClick={onSelect} />)}
      </div>
    </div>
  );
}

function LeaderCard({ member, onClick }) {
  return (
    <motion.article className="leader-card interactive-card" whileHover={{ y: -8, scale: 1.015 }} transition={{ duration: .25 }} onClick={() => onClick(member)}>
      <div className="leader-photo"><div className="leader-matrix">01<br />ΨΦ<br />10<br />C1</div><img src={member.image} alt={member.name} /></div>
      <div className="leader-info"><span>{member.role}</span><h3>{member.name}</h3><small>{member.year || 'CSE'}</small><div className="leader-links">{member.linkedin && <a href={member.linkedin || 'https://www.linkedin.com/'} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer"><LinkedinIcon size={14} /></a>}{member.github && <a href={member.github || 'https://github.com/'} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer"><GithubIcon size={14} /></a>}</div></div>
    </motion.article>
  );
}


function AutoEventImage({ event }) {
  const images = event.galleryImages?.length ? event.galleryImages : [event.image];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, [images.length]);
  return <div className="event-photo"><AnimatePresence mode="wait" initial={false}><motion.img key={images[index]} src={images[index]} alt={event.title} initial={{ opacity: 0, scale: 1.06, x: 18 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: .97, x: -18 }} transition={{ duration: .5, ease: [0.16, 1, .3, 1] }} /></AnimatePresence><span className="event-scan">{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')} · VIEW GALLERY →</span></div>;
}

function EventModal({ event, onClose }) {
  useBodyLock();
  const images = event.galleryImages?.length ? event.galleryImages : [event.image];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const change = (dir) => { setDirection(dir); setIndex((i) => (i + dir + images.length) % images.length); };
  const swipe = useSwipe(() => change(1), () => change(-1));

  const lastEdgeMove = useRef(0);
  const handlePhotoMove = (e) => {
    if (images.length < 2 || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const now = performance.now();
    if (now - lastEdgeMove.current < 700) return;
    if (px > .7) { lastEdgeMove.current = now; change(1); }
    else if (px < .3) { lastEdgeMove.current = now; change(-1); }
  };

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => change(1), 3200);
    return () => clearInterval(timer);
  }, [images.length]);
  const date = new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  return <motion.div className="modal-backdrop event-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div className="event-modal" initial={{ opacity: 0, scale: .94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 20 }} transition={{ duration: .45 }} onClick={(e) => e.stopPropagation()}>
      <div className="modal-copy"><div className="eyebrow">CIPHER // ACTIVITIES</div><h2>{event.title}</h2><div className="modal-meta">{date} · {event.location}</div><p>{event.fullDescription}</p></div>
      <div className="modal-gallery"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><div className="photo-card"><div className="photo-topline"><span>{event.slug?.replaceAll('-', '_').toUpperCase()}</span><span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span></div><div className="photo-stage" onPointerMove={handlePhotoMove} {...swipe}><AnimatePresence mode="popLayout" initial={false} custom={direction}><motion.img key={images[index]} custom={direction} src={images[index]} alt={event.title} initial={{ x: direction > 0 ? 130 : -130, opacity: 0, rotate: direction > 0 ? 8 : -8, scale: .88 }} animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }} exit={{ x: direction > 0 ? -130 : 130, opacity: 0, rotate: direction > 0 ? -8 : 8, scale: .92 }} transition={{ duration: .42, ease: [0.16, 1, .3, 1] }} /></AnimatePresence></div><div className="photo-caption"><span className="date-chip">{date}</span><strong>{event.title}</strong><small>{event.category} · {event.location}</small></div></div><div className="gallery-controls"><button onClick={() => change(-1)} aria-label="Previous photo"><ChevronLeft size={18} /></button><div className="gallery-count"><strong>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</strong><span>SWIPE TO EXPLORE →</span><div className="dots">{images.map((_, i) => <i key={i} className={i === index ? 'active' : ''} />)}</div></div><button onClick={() => change(1)} aria-label="Next photo"><ChevronRight size={18} /></button></div></div>
    </motion.div>
  </motion.div>;
}

function LeaderModal({ member, onClose }) {
  useBodyLock();
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.div className="leader-modal" initial={{ scale: .88, y: 25 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .9, y: 20 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }} onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18} /></button><img src={member.image} alt={member.name} /><div className="eyebrow">{member.role}</div><h2>{member.name}</h2><p>{member.bio || 'CIPHER core team member contributing to student-led technical activities and community initiatives.'}</p><div className="modal-socials">{member.linkedin && <a href={member.linkedin || 'https://www.linkedin.com/'} target="_blank" rel="noreferrer"><LinkedinIcon size={18} /></a>}{member.github && <a href={member.github || 'https://github.com/'} target="_blank" rel="noreferrer"><GithubIcon size={18} /></a>}</div></motion.div></motion.div>;
}

function JoinModal({ onClose }) {
  useBodyLock();
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.div className="join-modal" initial={{ y: 30, opacity: 0, scale: .96 }} animate={{ y: 0, opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18} /></button><JoinForm heading onDone={onClose} /></motion.div></motion.div>;
}

function ActivityVideoModal({ activity, index, onClose }) {
  useBodyLock();
  const video = activity.video;
  const [media, setMedia] = useState(null); // { kind: 'file' | 'embed', url }
  const [status, setStatus] = useState(video ? 'loading' : 'none');
  useEffect(() => {
    let cancelled = false; let objectUrl = null;
    if (!video) { setStatus('none'); return undefined; }
    if (video.type === 'link') {
      const url = safeUrl(video.url);
      if (!url) setStatus('missing');
      else { const embed = toEmbedUrl(url); setMedia(embed ? { kind: 'embed', url: embed } : { kind: 'file', url }); setStatus('ready'); }
    } else if (video.url) {
      setMedia({ kind: 'file', url: video.url }); setStatus('ready');
    } else {
      getVideo(video.id).then((blob) => {
        if (cancelled) return;
        if (!blob) return setStatus('missing');
        objectUrl = URL.createObjectURL(blob); setMedia({ kind: 'file', url: objectUrl }); setStatus('ready');
      }).catch(() => !cancelled && setStatus('missing'));
    }
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [video]);
  const message = status === 'none' ? 'No video has been added for this activity yet.' : status === 'missing' ? 'This video could not be loaded. Re-upload it (or fix the link) in Admin → Pages & Content → Activities.' : 'Loading video…';
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div className="video-modal" initial={{ opacity: 0, scale: .94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 20 }} transition={{ duration: .4 }} onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
      <div className="eyebrow">CIPHER // ACTIVITY {String(index + 1).padStart(2, '0')}</div>
      <h2>{activity.title}</h2>
      <div className="video-stage">
        {status === 'ready' && media?.kind === 'file' && <video src={media.url} controls autoPlay playsInline controlsList="nodownload" />}
        {status === 'ready' && media?.kind === 'embed' && <iframe src={media.url} title={activity.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />}
        {status !== 'ready' && <div className="video-empty">&gt; {message}</div>}
      </div>
    </motion.div>
  </motion.div>;
}

function RootAccess({ onClose }) {
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.div className="root-modal" initial={{ scale: .82, opacity: 0, filter: 'blur(12px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} onClick={(e) => e.stopPropagation()}><div className="eyebrow">// BACKDOOR CONNECTION</div><h2>ROOT ACCESS</h2><p>&gt; You found the backdoor. Welcome to the inner circle of CIPHER.</p><p>The real code was inside you all along.</p><button className="btn outline" onClick={onClose}>[ CLOSE CONNECTION ]</button></motion.div></motion.div>;
}

export function HomePage() {
  const [bootCompleted, setBootCompleted] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [rootOpen, setRootOpen] = useState(false);
  const [backdoorClicks, setBackdoorClicks] = useState(0);

  const { content } = useContent();
  const leaders = useMemo(() => [...(content.team.officeBearers || []), ...(content.team.coreTeam || [])], [content.team]);
  const heroEvents = content.events.slice(0, 2);
  const home = content.site.home || {};
  const domains = home.domains || [];
  const activityList = useMemo(() => (home.activities || []).map(normalizeActivity), [home.activities]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  return <>
    <AnimatePresence>{!bootCompleted && <MatrixBoot onComplete={() => setBootCompleted(true)} />}</AnimatePresence>
    <div className="app-shell">
      <TopographicBackground />
      <ReticleCursor />
      <PublicHeader />
      <main>
        <section id="home" className="hero section">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">{home.heroEyebrow}</div>
            <HackerCipher start={bootCompleted} />
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .7 }}>{home.heroTagline}</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45, duration: .7 }}>{home.heroText}</motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6, duration: .6 }}><Link to="/contact" className="btn primary">JOIN CIPHER <ArrowRight size={16} /></Link><Link to="/events" className="btn outline">EXPLORE EVENTS</Link></motion.div>
          </div>
          <button className="backdoor-trigger" aria-label="backdoor" onClick={() => { const next = backdoorClicks + 1; setBackdoorClicks(next); if (next >= 3) setRootOpen(true); }}>!backdoor</button>
        </section>

        <section id="about" className="about section">
          <Reveal><div className="eyebrow">// ABOUT</div><h2><ScrambleTitle text="Who we are" /></h2></Reveal>
          <div className="about-grid">
            <Reveal delay={.08}><p>{content.site.about?.homeSummary || <><strong>CIPHER</strong> is the CSE student association at SJEC — a platform for technical learning, collaboration, leadership and student-led activities.</>}</p><Link to="/about" className="btn outline">LEARN MORE <ArrowRight size={15} /></Link></Reveal>
            <Reveal delay={.16}><Collage /></Reveal>
          </div>
        </section>

        <section className="domains section"><Reveal><div className="eyebrow">// WHAT WE DO</div><h2><ScrambleTitle text="Our Domains" /></h2></Reveal><div className="domain-grid">{domains.map(({ title, sessions, desc }, i) => { const Icon = domainIcons[i % domainIcons.length]; return <motion.article key={`${title}-${i}`} className="domain-card interactive-card" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: i * .08, duration: .55 }} whileHover={{ y: -8 }}><div className="domain-head"><span className="domain-icon"><Icon size={19} /></span><span className="session-badge">{sessions}</span></div><h3>{title}</h3><p>{desc}</p></motion.article>; })}</div></section>

        <section id="leadership" className="leadership section"><Reveal><div className="eyebrow">// GOVERNANCE</div><h2><ScrambleTitle text="Leadership Structure" /></h2></Reveal><LeadershipCarousel leaders={leaders} onSelect={setSelectedLeader} /><div className="section-link-row"><Link to="/team" className="btn outline">VIEW FULL LEADERSHIP <ArrowRight size={15} /></Link></div></section>

        <section id="events" className="events section"><Reveal><div className="eyebrow">// ACTIVITIES</div><h2><ScrambleTitle text="Events & Workshops" /></h2></Reveal><div className="event-grid">{heroEvents.map((event, i) => <motion.article key={event.id} className="event-card interactive-card" initial={{ opacity: 0, x: i ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .65, delay: i * .12 }} whileHover={{ y: -7 }} onClick={() => setSelectedEvent(event)}><AutoEventImage event={event} /><div className="event-top"><span><CalendarDays size={14} /> {event.category}</span><time>{new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</time></div><h3>{event.title}</h3><p>{event.shortDescription}</p><button className="event-gallery-btn" onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>VIEW GALLERY <ArrowRight size={14} /></button></motion.article>)}</div><div className="section-link-row"><Link to="/events" className="btn outline">VIEW ALL EVENTS <ArrowRight size={15} /></Link></div></section>

        <section className="archive section"><Reveal><div className="eyebrow">// ARCHIVE</div><h2><ScrambleTitle text="Activities" /></h2><p className="archive-intro">{home.activitiesIntro}</p></Reveal><div className="activity-grid">{activityList.slice(0, 6).map((item, i) => { const open = () => setSelectedActivity({ ...item, index: i }); return <motion.article key={`${item.title}-${i}`} className="activity-item interactive-card" role="button" tabIndex={0} onClick={open} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())} initial={{ opacity: 0, x: i % 2 ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .38, delay: Math.min(i * .025, .3) }} whileHover={{ x: 7 }}><span>// {String(i + 1).padStart(2, '0')}</span><strong>{item.title}</strong><button type="button" className="activity-arrow" aria-label={`Watch video: ${item.title}`} onClick={(e) => { e.stopPropagation(); open(); }}><ArrowUpRight size={16} /></button></motion.article>; })}</div><div className="section-link-row"><Link to="/about" className="btn outline">EXPLORE ACTIVITIES <ArrowRight size={15} /></Link></div></section>

        <section id="join" className="join section"><Reveal><div className="eyebrow">// ACCESS CLUB</div><h2><ScrambleTitle text="Join the Team" /></h2><p>{home.joinText}</p><div className="join-actions"><Link to="/contact" className="btn primary">JOIN <ArrowRight size={16} /></Link><a href="#home" className="btn outline">BACK TO TOP</a></div></Reveal></section>
      </main>

      <PublicFooter />

      <AnimatePresence>{selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}{selectedLeader && <LeaderModal member={selectedLeader} onClose={() => setSelectedLeader(null)} />}{selectedActivity && <ActivityVideoModal activity={selectedActivity} index={selectedActivity.index} onClose={() => setSelectedActivity(null)} />}{rootOpen && <RootAccess onClose={() => setRootOpen(false)} />}</AnimatePresence>
    </div>
  </>;
}

function RouteScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto'; // no smooth-scroll drift across the old page
    window.scrollTo(0, 0);
    requestAnimationFrame(() => { root.style.scrollBehavior = prev; });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <RouteScrollReset />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<PageShell><About /></PageShell>} />
          <Route path="/events" element={<PageShell><Events /></PageShell>} />
          <Route path="/team" element={<PageShell><Team /></PageShell>} />
          <Route path="/leadership" element={<PageShell><Team /></PageShell>} />
          <Route path="/contact" element={<PageShell><Contact /></PageShell>} />
          <Route path="/join" element={<PageShell><Contact /></PageShell>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="team" element={<ManageTeam />} />
            <Route path="requests" element={<JoinRequests />} />
            <Route path="about" element={<ManageAbout />} />
            <Route path="site" element={<SiteContent />} />
            <Route path="security" element={<Security />} />
          </Route>
          <Route path="*" element={<PageShell><About /></PageShell>} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
