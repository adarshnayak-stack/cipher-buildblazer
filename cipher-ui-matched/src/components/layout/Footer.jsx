import React from 'react';
import { Link } from 'react-router-dom';
import { siteContent } from '../../data/siteContent';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--green-border)', padding: '3.5rem 8vw 2rem 8vw',
      background: '#020503', color: 'var(--text-muted)', fontSize: '0.85rem'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h4 style={{ color: 'var(--green-primary)', marginBottom: '0.8rem', fontSize: '1.2rem' }}>CIPHER</h4>
          <p style={{ lineHeight: 1.6 }}>Student Association of the Department of Computer Science &amp; Engineering, SJEC.</p>
        </div>
        <div>
          <h5 style={{ color: '#fff', marginBottom: '0.8rem' }}>Quick Links</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About</Link>
            <Link to="/events" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Events</Link>
            <Link to="/team" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Team</Link>
            <Link to="/achievements" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Achievements</Link>
            <Link to="/gallery" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Gallery</Link>
          </div>
        </div>
        <div>
          <h5 style={{ color: '#fff', marginBottom: '0.8rem' }}>Contact Information</h5>
          <p>{siteContent.contact.email}</p>
          <p>{siteContent.contact.department}</p>
          <p>{siteContent.contact.college}</p>
          <p>{siteContent.contact.location}</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(0,255,102,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span>&gt; © 2026 CIPHER SJEC. All rights reserved.</span>
        <span>St. Joseph Engineering College, Mangaluru</span>
      </div>
    </footer>
  );
}