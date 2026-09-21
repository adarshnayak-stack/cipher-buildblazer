import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(3, 8, 4, 0.9)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--green-border)', padding: '0.85rem 6vw',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--green-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-primary)',
          fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 0 12px var(--green-glow)'
        }}>
          [C]
        </div>
        <span style={{ fontWeight: 700, letterSpacing: '0.1em', color: 'var(--green-primary)' }}>CIPHER</span>
      </Link>

      {/* Desktop Navigation */}
      <nav style={{ display: 'none', gap: '1.8rem', alignItems: 'center' }} className="desktop-nav">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            style={({ isActive }) => ({
              color: isActive ? 'var(--green-primary)' : 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              fontWeight: isActive ? 600 : 400
            })}
          >
            {link.name.toUpperCase()}
          </NavLink>
        ))}
        <Link to="/join" className="btn-cyber-solid" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
          JOIN US
        </Link>
      </nav>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ background: 'transparent', border: 'none', color: 'var(--green-primary)', cursor: 'pointer', display: 'block' }}
        className="mobile-nav-toggle"
      >
        {mobileOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(3, 8, 4, 0.98)', borderBottom: '1px solid var(--green-border)',
          padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem'
        }}>
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                color: isActive ? 'var(--green-primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.95rem'
              })}
            >
              {link.name.toUpperCase()}
            </NavLink>
          ))}
          <Link to="/join" onClick={() => setMobileOpen(false)} className="btn-cyber-solid" style={{ textAlign: 'center' }}>
            JOIN US
          </Link>
        </div>
      )}
    </header>
  );
}