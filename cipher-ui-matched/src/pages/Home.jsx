import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroCanvas from '../components/HeroCanvas';
import { eventsData } from '../data/events';
import { teamData } from '../data/team';
import { ChevronLeft, ChevronRight, X, Mail } from 'lucide-react';

// Native SVG Icons for brands to avoid Lucide export errors
const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

function ScrambleText({ text }) {
  const [display, setDisplay] = useState(text);
  const chars = '!@#$%^&*()_+-=~[]{}|;:,.<>?/01';

  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, idx) => (idx < iteration ? text[idx] : chars[Math.floor(Math.random() * chars.length)]))
          .join('')
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 25);
  };

  useEffect(() => { scramble(); }, [text]);
  return <span onMouseEnter={scramble} style={{ cursor: 'crosshair' }}>{display}</span>;
}

export default function Home() {
  const [showRootAccess, setShowRootAccess] = useState(false);
  const [isWhoHovered, setIsWhoHovered] = useState(false);

  // Leadership Mouse Slider State
  const [carouselOffset, setCarouselOffset] = useState(0);

  // Leader Zoom Modal
  const [zoomLeader, setZoomLeader] = useState(null);

  // Event Gallery Modal State
  const [selectedGalleryEvent, setSelectedGalleryEvent] = useState(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [isCardFlying, setIsCardFlying] = useState(false);

  // Mouse tracking carousel slide
  const handleLeadershipMouseMove = (e) => {
    const ratio = (e.clientX / window.innerWidth) - 0.5;
    setCarouselOffset(-ratio * 320);
  };

  const handleNextPhoto = () => {
    if (!selectedGalleryEvent || isCardFlying) return;
    setIsCardFlying(true);
    setTimeout(() => {
      setGalleryIdx((prev) => (prev + 1 < selectedGalleryEvent.galleryImages.length ? prev + 1 : 0));
      setIsCardFlying(false);
    }, 380);
  };

  const handlePrevPhoto = () => {
    if (!selectedGalleryEvent || isCardFlying) return;
    setIsCardFlying(true);
    setTimeout(() => {
      setGalleryIdx((prev) => (prev > 0 ? prev - 1 : selectedGalleryEvent.galleryImages.length - 1));
      setIsCardFlying(false);
    }, 380);
  };

  const photoCollage = [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop'
  ];

  return (
    <div style={{ paddingTop: '80px', position: 'relative', zIndex: 10 }}>
      {/* 1. HERO SECTION */}
      <section style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8vw' }}>
        <div style={{ color: 'var(--green-primary)', fontSize: '0.85rem', letterSpacing: '0.2em' }}>
          // EST. DEPARTMENT OF CSE // SJEC
        </div>
        <HeroCanvas />
        <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2.2rem)', fontWeight: 400, color: '#fff', marginBottom: '1rem', fontFamily: 'var(--font-sans)' }}>
          Student Association of Computer Science &amp; Engineering
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '680px', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Bridging academic knowledge and practical application — a community of aspiring professionals in computing.
        </p>
        <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
          <Link to="/join" className="btn-cyber-solid">JOIN CIPHER →</Link>
          <Link to="/events" className="btn-cyber-outline">EXPLORE EVENTS</Link>
        </div>
      </section>

      {/* 2. WHO WE ARE (Photo Collage on Hover) */}
      <section style={{ padding: '6rem 8vw' }}>
        <div style={{ color: 'var(--green-primary)', fontSize: '0.85rem', marginBottom: '0.6rem', letterSpacing: '0.15em' }}>// ABOUT</div>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', marginBottom: '2.5rem', fontFamily: 'var(--font-sans)' }}>
          <ScrambleText text="Who we are" />
        </h3>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}
          onMouseEnter={() => setIsWhoHovered(true)}
          onMouseLeave={() => setIsWhoHovered(false)}
        >
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.9, marginBottom: '2rem' }}>
              <strong style={{ color: 'var(--green-primary)' }}>CIPHER</strong> is the student association of the Department of Computer Science &amp; Engineering. It serves as a platform for students to nurture their technical and interpersonal skills through innovative and collaborative activities. The association strives to bridge the gap between academic knowledge and practical application.
            </p>
            <Link to="/about" className="btn-cyber-outline">LEARN MORE →</Link>
          </div>

          <div style={{ position: 'relative', minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                fontWeight: 900,
                color: 'var(--green-primary)',
                textShadow: '0 0 35px var(--green-glow)',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                userSelect: 'none',
                zIndex: 5
              }}
              onClick={() => setShowRootAccess(true)}
            >
              CIPHER
            </div>

            {photoCollage.map((src, idx) => {
              const transforms = [
                'translate(-90px, -70px) rotate(-6deg)',
                'translate(100px, -80px) rotate(8deg)',
                'translate(-80px, 70px) rotate(5deg)',
                'translate(90px, 80px) rotate(-7deg)'
              ];
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    width: '170px',
                    height: '115px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1.5px solid var(--green-primary)',
                    boxShadow: '0 0 16px rgba(0, 255, 102, 0.4)',
                    opacity: isWhoHovered ? 1 : 0,
                    transform: isWhoHovered ? transforms[idx] : 'translate(0, 0) scale(0.4)',
                    transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                >
                  <img src={src} alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. OUR DOMAINS */}
      <section style={{ padding: '6rem 8vw' }}>
        <div style={{ color: 'var(--green-primary)', fontSize: '0.85rem', marginBottom: '0.6rem', letterSpacing: '0.15em' }}>// WHAT WE DO</div>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', marginBottom: '2.5rem', fontFamily: 'var(--font-sans)' }}>
          <ScrambleText text="Our Domains" />
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.8rem' }}>
          {[
            { tag: '</>', title: 'Technical Skill Building', sessions: '5 SESSIONS', desc: 'Hands-on workshops, coding sessions, and tech talks turning theory into working software.' },
            { tag: '♔', title: 'Leadership & Governance', sessions: '3 SESSIONS', desc: 'Annual elections for President, Secretary, and office bearers — guided by the HOD and Coordinator.' },
            { tag: '⚡', title: 'Events & Collaboration', sessions: '8 SESSIONS', desc: 'Hackathons, seminars, and department-level competitions that bring students together.' },
            { tag: '🚀', title: 'Industry Readiness', sessions: '4 SESSIONS', desc: 'Bridging classroom learning with real-world application to prepare students for the field.' }
          ].map((item, i) => (
            <div key={i} className="hud-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.3rem', color: 'var(--green-primary)' }}>{item.tag}</span>
                <span style={{ border: '1px solid var(--green-border)', background: 'var(--green-dim)', padding: '0.25rem 0.6rem', fontSize: '0.7rem', color: 'var(--green-primary)' }}>
                  {item.sessions}
                </span>
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.8rem', fontFamily: 'var(--font-sans)' }}>{item.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LEADERSHIP STRUCTURE */}
      <section
        style={{ padding: '6rem 0 6rem 8vw', overflow: 'hidden' }}
        onMouseMove={handleLeadershipMouseMove}
      >
        <div style={{ paddingRight: '8vw' }}>
          <div style={{ color: 'var(--green-primary)', fontSize: '0.85rem', letterSpacing: '0.15em' }}>// GOVERNANCE</div>
          <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', marginBottom: '2.5rem', fontFamily: 'var(--font-sans)' }}>
            <ScrambleText text="Leadership Structure" />
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            transform: `translateX(${carouselOffset}px)`,
            transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.4, 1)',
            width: 'max-content'
          }}
        >
          {teamData.officeBearers.map((m) => (
            <div
              key={m.id}
              className="hud-panel"
              style={{ width: '280px', flexShrink: 0, overflow: 'hidden', cursor: 'pointer', background: '#040b06' }}
              onClick={() => setZoomLeader(m)}
            >
              <div style={{
                height: '320px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(0,255,102,0.1) 0%, #030804 100%)'
              }}>
                <img
                  src={m.image}
                  alt={m.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.15)', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'grayscale(0%)')}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = 'grayscale(100%) contrast(1.15)')}
                />
              </div>

              <div style={{ padding: '1.4rem' }}>
                <div style={{ color: 'var(--green-primary)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>{m.role}</div>
                <h5 style={{ color: '#fff', fontSize: '1.15rem', margin: '0.35rem 0 0.75rem 0', fontFamily: 'var(--font-sans)' }}>{m.name}</h5>
                
                <div style={{ display: 'flex', gap: '0.8rem', color: 'var(--green-primary)' }}>
                  {m.github && <a href={m.github} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><GithubIcon size={16} /></a>}
                  {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><LinkedinIcon size={16} /></a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EVENTS & WORKSHOPS */}
      <section style={{ padding: '6rem 8vw' }}>
        <div style={{ color: 'var(--green-primary)', fontSize: '0.85rem', letterSpacing: '0.15em' }}>// ACTIVITIES</div>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', marginBottom: '2.5rem', fontFamily: 'var(--font-sans)' }}>
          <ScrambleText text="Events & Workshops" />
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {eventsData.slice(0, 2).map((evt) => (
            <div key={evt.id} className="hud-panel" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--green-primary)' }}>{evt.category}</span>
                <span style={{ color: 'var(--text-muted)' }}>{evt.date}</span>
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.8rem', fontFamily: 'var(--font-sans)' }}>{evt.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '2rem' }}>{evt.shortDescription}</p>
              <button
                onClick={() => { setSelectedGalleryEvent(evt); setGalleryIdx(0); }}
                className="btn-cyber-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                VIEW GALLERY &gt;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. JOIN CTA & SOCIAL FOOTER */}
      <section style={{ padding: '8rem 8vw 4rem 8vw', textAlign: 'center' }}>
        <div style={{ color: 'var(--green-primary)', fontSize: '0.85rem', letterSpacing: '0.2em', marginBottom: '1rem' }}>// ACCESS CLUB</div>
        <h3 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: '#fff', marginBottom: '1.2rem', fontFamily: 'var(--font-sans)' }}>
          <ScrambleText text="Join the Team" />
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2.5rem auto', lineHeight: 1.8 }}>
          Whether you want to build, lead, or simply learn — CIPHER is where CSE students turn curiosity into capability.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link to="/join" className="btn-cyber-solid">JOIN →</Link>
          <a href="#home" className="btn-cyber-outline">BACK TO TOP</a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
          <a href="mailto:cipher@sjec.ac.in" className="social-icon-btn"><Mail size={18} /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn"><LinkedinIcon size={18} /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-btn"><GithubIcon size={18} /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn"><InstagramIcon size={18} /></a>
        </div>
      </section>

      {/* MODAL 1: Leader Profile Zoom */}
      {zoomLeader && (
        <div className="modal-backdrop" onClick={() => setZoomLeader(null)}>
          <div className="hud-panel" style={{ width: '380px', padding: '2rem', background: '#050f08' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <span style={{ color: 'var(--green-primary)', fontSize: '0.8rem' }}>{zoomLeader.role}</span>
              <button onClick={() => setZoomLeader(null)} style={{ background: 'transparent', border: 'none', color: 'var(--green-primary)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <img src={zoomLeader.image} alt={zoomLeader.name} style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1.2rem' }} />
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.4rem', fontFamily: 'var(--font-sans)' }}>{zoomLeader.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>{zoomLeader.desc}</p>
            <div style={{ display: 'flex', gap: '0.8rem', color: 'var(--green-primary)' }}>
              {zoomLeader.github && <a href={zoomLeader.github} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><GithubIcon size={18} /></a>}
              {zoomLeader.linkedin && <a href={zoomLeader.linkedin} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><LinkedinIcon size={18} /></a>}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Events Smooth Photo Deck Fly-Off Carousel */}
      {selectedGalleryEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedGalleryEvent(null)}>
          <div
            className="hud-panel"
            style={{ width: '920px', maxWidth: '95vw', padding: '2.5rem', background: '#040d07', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'var(--green-primary)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                  CIPHER // ACTIVITIES
                </div>
                <h3 style={{ fontSize: '2rem', color: '#fff', margin: '0.6rem 0', fontFamily: 'var(--font-sans)' }}>
                  {selectedGalleryEvent.title}
                </h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  {selectedGalleryEvent.date} · {selectedGalleryEvent.location}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.75 }}>
                  {selectedGalleryEvent.fullDescription}
                </p>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <span className="btn-cyber-solid" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
                  {selectedGalleryEvent.category}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '0.8rem' }}>
                <button onClick={() => setSelectedGalleryEvent(null)} style={{ background: 'transparent', border: 'none', color: 'var(--green-primary)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ width: '100%', height: '320px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--green-border)', position: 'relative', background: '#020503' }}>
                <img
                  key={galleryIdx}
                  src={selectedGalleryEvent.galleryImages[galleryIdx]}
                  alt="Gallery"
                  className={isCardFlying ? 'gallery-card-exit' : 'gallery-card-current'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '1.5rem' }}>
                <button onClick={handlePrevPhoto} className="btn-cyber-outline" style={{ padding: '0.5rem 0.8rem' }}>
                  <ChevronLeft size={16} />
                </button>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ color: 'var(--green-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                    0{galleryIdx + 1} / 0{selectedGalleryEvent.galleryImages.length}
                  </span>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>SWIPE TO EXPLORE</div>
                </div>
                <button onClick={handleNextPhoto} className="btn-cyber-outline" style={{ padding: '0.5rem 0.8rem' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ROOT ACCESS BACKDOOR */}
      {showRootAccess && (
        <div className="modal-backdrop" onClick={() => setShowRootAccess(false)}>
          <div className="hud-panel" style={{ width: '520px', padding: '3rem 2.5rem', background: '#050f08', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--green-primary)', textShadow: '0 0 25px var(--green-glow)', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)' }}>
              ROOT ACCESS
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2.2rem' }}>
              &gt; You found the backdoor. Welcome to the inner circle of CIPHER.
            </p>
            <button onClick={() => setShowRootAccess(false)} className="btn-cyber-outline">
              [ CLOSE CONNECTION ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}