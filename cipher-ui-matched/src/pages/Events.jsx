import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import useBodyLock from '../hooks/useBodyLock';
import useSwipe from '../hooks/useSwipe';

function EventImage({ event }) {
  const images = event.galleryImages?.length ? event.galleryImages : [event.image];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const lastEdgeMove = React.useRef(0);

  const change = (dir) => {
    if (images.length < 2) return;
    setDirection(dir);
    setIndex(i => (i + dir + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => change(1), 4200);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (py - .5) * -3, y: (px - .5) * 5 });
    const now = performance.now();
    if (now - lastEdgeMove.current < 700 || images.length < 2) return;
    if (px > .78) { lastEdgeMove.current = now; change(1); }
    else if (px < .22) { lastEdgeMove.current = now; change(-1); }
  };

  return (
    <motion.div className="event-page-image" onMouseMove={handleMove} style={{ rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: 'spring', stiffness: 150, damping: 18 }}>
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.img key={images[index]} src={images[index]} alt={event.title} custom={direction} initial={{ opacity: 0, scale: .82, x: direction > 0 ? 90 : -90, rotate: direction > 0 ? 5 : -5 }} animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, scale: .92, x: direction > 0 ? -90 : 90, rotate: direction > 0 ? -5 : 5 }} transition={{ duration: .65, ease: [0.16, 1, .3, 1] }} />
      </AnimatePresence>
      <button className="event-image-arrow left" aria-label="Previous event photo" onClick={(e) => { e.stopPropagation(); change(-1); }}><ChevronLeft size={17} /></button>
      <button className="event-image-arrow right" aria-label="Next event photo" onClick={(e) => { e.stopPropagation(); change(1); }}><ChevronRight size={17} /></button>
      <span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
    </motion.div>
  );
}

function GalleryModal({ event, onClose }) {
  useBodyLock();
  const images = event.galleryImages?.length ? event.galleryImages : [event.image];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const move = dir => { setDirection(dir); setIndex(i => (i + dir + images.length) % images.length); };
  const swipe = useSwipe(() => move(1), () => move(-1));
  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => move(1), 3200);
    return () => clearInterval(timer);
  }, [images.length]);
  const d = new Date(event.date);
  const date = isNaN(d) ? event.date : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  return (
    <motion.div className="modal-backdrop event-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="event-modal" initial={{ opacity: 0, y: 35, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .97 }} onClick={e => e.stopPropagation()}>
        <div className="modal-copy"><div className="eyebrow">CIPHER // ACTIVITIES</div><h2>{event.title}</h2><div className="modal-meta">{date} · {event.location}</div><p>{event.fullDescription}</p></div>
        <div className="modal-gallery"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><div className="photo-card"><div className="photo-topline"><span>{event.slug?.replaceAll('-', '_').toUpperCase()}</span><span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span></div><div className="photo-stage" {...swipe}><AnimatePresence mode="popLayout" initial={false} custom={direction}><motion.img key={images[index]} src={images[index]} alt={event.title} custom={direction} initial={{ x: direction > 0 ? 170 : -170, opacity: 0, rotate: direction > 0 ? 9 : -9, scale: .86 }} animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }} exit={{ x: direction > 0 ? -170 : 170, opacity: 0, rotate: direction > 0 ? -9 : 9, scale: .9 }} transition={{ duration: .55, ease: [0.16, 1, .3, 1] }} /></AnimatePresence></div><div className="photo-caption"><span className="date-chip">{date}</span><strong>{event.title}</strong><small>{event.category} · {event.location}</small></div></div><div className="gallery-controls"><button onClick={() => move(-1)} aria-label="Previous photo"><ChevronLeft size={18} /></button><div className="gallery-count"><strong>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</strong><span>SWIPE OR AUTO-SLIDE</span><div className="dots">{images.map((_, i) => <i key={i} className={i === index ? 'active' : ''} />)}</div></div><button onClick={() => move(1)} aria-label="Next photo"><ChevronRight size={18} /></button></div></div>
      </motion.div>
    </motion.div>
  );
}

export default function Events() {
  const { content } = useContent();
  const [filter, setFilter] = useState('ALL');
  const [active, setActive] = useState(null);
  const filtered = useMemo(() => content.events.filter(e => filter === 'ALL' || e.status === filter.toLowerCase()), [content.events, filter]);
  return (
    <div className="page-content">
      <section className="inner-hero section">
        <div className="eyebrow">{content.site.events?.eyebrow}</div>
        <h1>{content.site.events?.heading}</h1>
        <p>{content.site.events?.intro}</p>
      </section>
      <section className="detail-section section">
        <div className="filter-row">{['ALL', 'UPCOMING', 'COMPLETED'].map(tab => <button key={tab} onClick={() => setFilter(tab)} className={`filter-chip ${filter === tab ? 'active' : ''}`}>{tab}</button>)}</div>
        <div className="event-page-grid">
          {filtered.map((event, i) => <motion.article key={event.id} className="event-page-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }} whileHover={{ y: -8 }}>
            <EventImage event={event} />
            <div className="event-page-copy"><div className="event-top"><span><CalendarDays size={13} /> {event.category}</span><time>{event.date}</time></div><h3>{event.title}</h3><p>{event.shortDescription}</p><button className="event-gallery-btn" onClick={() => setActive(event)}>VIEW GALLERY <ArrowRight size={14} /></button></div>
          </motion.article>)}
        </div>
      </section>
      <AnimatePresence>{active && <GalleryModal event={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </div>
  );
}
