import React from 'react';
import { Link, NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { useJoinRequests } from '../data/joinRequests';
import { isAdminAuthenticated, logoutAdmin } from './auth';
import ReticleCursor from '../components/ReticleCursor';

export default function AdminLayout() {
  const navigate = useNavigate();
  const unread = useJoinRequests().filter(r => r.status === 'new').length;
  if (!isAdminAuthenticated()) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const links = [
    ['/admin', 'Overview'],
    ['/admin/events', 'Events'],
    ['/admin/team', 'Leadership'],
    ['/admin/requests', 'Join Requests'],
    ['/admin/about', 'Pages & Content'],
    ['/admin/site', 'Site Content'],
    ['/admin/security', 'Security'],
  ];

  return (
    <>
      <ReticleCursor />
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link to="/admin" className="admin-brand"><BrandLogo alt="CIPHER" /><div><strong>CIPHER</strong><span>PRIVATE CMS</span></div></Link>
          <div className="admin-divider" />
          <nav>{links.map(([to, label]) => <NavLink key={to} end={to === '/admin'} to={to} className={({ isActive }) => isActive ? 'active' : ''}>{label}{to === '/admin/requests' && unread > 0 && <span className="nav-badge">{unread}</span>}</NavLink>)}</nav>
          <div className="admin-sidebar-bottom">
            <Link to="/">↗ Public Website</Link>
            <button onClick={logout}>↪ Logout</button>
          </div>
        </aside>
        <main className="admin-main"><Outlet /></main>
      </div>
    </>
  );
}
