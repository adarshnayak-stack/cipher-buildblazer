import React, { useState } from 'react';
import { siteContent } from '../data/siteContent';

export default function Gallery() {
  const [filter, setFilter] = useState('ALL');
  const [activePhoto, setActivePhoto] = useState(null);

  const images = siteContent.gallery.filter(g => filter === 'ALL' || g.category === filter);

  return (
    <div style={{ padding: '120px 8vw 6rem 8vw' }}>
      <div style={{ color: 'var(--green-primary)', fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>// MEDIA LOGS</div>
      <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', marginBottom: '2.5rem', fontFamily: 'var(--font-sans)' }}>Image Gallery</h1>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {['ALL', 'EVENTS', 'WORKSHOPS', 'COMPETITIONS', 'TEAM'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? 'btn-cyber-solid' : 'btn-cyber-outline'}
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.8rem' }}>
        {images.map((img) => (
          <div
            key={img.id}
            className="hud-panel"
            style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
            onClick={() => setActivePhoto(img)}
          >
            <div style={{ height: '260px', overflow: 'hidden' }}>
              <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
            </div>
            <div style={{ padding: '1rem', background: 'rgba(3,8,4,0.9)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--green-primary)' }}>{img.category}</span>
              <div style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.2rem' }}>{img.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="modal-backdrop" onClick={() => setActivePhoto(null)}>
          <div className="hud-panel" style={{ maxWidth: '90vw', padding: '1.5rem', background: '#050f08' }} onClick={(e) => e.stopPropagation()}>
            <img src={activePhoto.url} alt={activePhoto.title} style={{ maxHeight: '75vh', maxWidth: '100%', objectFit: 'contain' }} />
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--green-primary)' }}>{activePhoto.title}</span>
              <button onClick={() => setActivePhoto(null)} className="btn-cyber-outline" style={{ padding: '0.4rem 0.8rem' }}>[ CLOSE ]</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}