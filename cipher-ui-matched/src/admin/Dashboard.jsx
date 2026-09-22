import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useJoinRequests } from '../data/joinRequests';

export default function Dashboard() {
  const { content } = useContent();
  const teamCount = (content.team.officeBearers?.length || 0) + (content.team.coreTeam?.length || 0);
  const newRequests = useJoinRequests().filter(r => r.status === 'new').length;
  const upcoming = content.events.filter(e => e.status === 'upcoming').length;

  return <div className="admin-page">
    <div className="admin-page-head"><div><div className="admin-kicker">// CONTROL CENTER</div><h1>Website Management</h1><p>Update CIPHER content without opening VS Code or editing website source files.</p></div></div>
    {newRequests > 0 && <Link to="/admin/requests" className="jr-alert">🔔 {newRequests} new join request{newRequests > 1 ? 's' : ''} — click to review →</Link>}
    <div className="admin-stats">
      <div><span>EVENTS</span><strong>{content.events.length}</strong><small>{upcoming} upcoming</small></div>
      <div><span>LEADERSHIP</span><strong>{teamCount}</strong><small>visible profiles</small></div>
      <div><span>JOIN REQUESTS</span><strong>{newRequests}</strong><small>unread</small></div>
      <div><span>CONTENT</span><strong>LIVE</strong><small>browser CMS storage</small></div>
    </div>
    <div className="admin-quick-grid">
      <Link to="/admin/events"><span>// 01</span><h2>Manage Events</h2><p>Add new events, edit details, change galleries, registration links, and remove old events.</p><b>OPEN EVENTS →</b></Link>
      <Link to="/admin/team"><span>// 02</span><h2>Manage Leadership</h2><p>Add, edit, reorder, or remove office bearers and core team profiles with social links.</p><b>OPEN LEADERSHIP →</b></Link>
      <Link to="/admin/site"><span>// 03</span><h2>Edit Site Content</h2><p>Update the About and Join sections without touching the React source code.</p><b>OPEN CONTENT →</b></Link>
    </div>
  </div>;
}
