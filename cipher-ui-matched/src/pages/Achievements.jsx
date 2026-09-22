import React from 'react';
import { siteContent } from '../data/siteContent';

export default function Achievements() {
  return (
    <div style={{ padding: '120px 8vw 6rem 8vw' }}>
      <div style={{ color: 'var(--green-primary)', fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>// RECOGNITION &amp; MILESTONES</div>
      <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', marginBottom: '3rem', fontFamily: 'var(--font-sans)' }}>Achievements</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {siteContent.achievements.map((item, idx) => (
          <div key={idx} className="hud-panel" style={{ padding: '2.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ border: '1px solid var(--green-border)', background: 'var(--green-dim)', padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: 'var(--green-primary)' }}>
                {item.year}
              </span>
              <span style={{ color: 'var(--green-primary)', fontSize: '0.85rem' }}>{item.position}</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>{item.title}</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Event: {item.event}</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}