import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';

const links = [
  ['HOME', '/'],
  ['ABOUT', '/about'],
  ['LEADERSHIP', '/team'],
  ['EVENTS', '/events'],
  ['JOIN', '/contact'],
];

export default function PublicHeader({ onJoin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 35);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const joinAction = onJoin ? (
    <button className="header-join" onClick={onJoin}>JOIN CIPHER</button>
  ) : (
    <Link className="header-join header-join-link" to="/contact">JOIN CIPHER</Link>
  );

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Link to="/" className="brand" aria-label="CIPHER home">
        <BrandLogo />
      </Link>

      <nav className="main-nav" aria-label="Primary navigation">
        {links.map(([label, path]) => (
          <Link key={label} className={location.pathname === path || (path === '/team' && location.pathname === '/leadership') ? 'active' : ''} to={path}>
            {label}
          </Link>
        ))}
      </nav>

      {joinAction}

      <button className="mobile-menu-button" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle navigation">
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && (
        <div className="mobile-nav-panel">
          {links.map(([label, path]) => (
            <Link key={label} to={path} className={location.pathname === path ? 'active' : ''}>{label}</Link>
          ))}
          {onJoin ? (
            <button className="header-join mobile-join" onClick={onJoin}>JOIN CIPHER</button>
          ) : (
            <Link className="header-join mobile-join" to="/contact">JOIN CIPHER</Link>
          )}
        </div>
      )}
    </header>
  );
}

