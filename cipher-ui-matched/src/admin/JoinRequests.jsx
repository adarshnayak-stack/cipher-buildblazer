import React, { useState } from 'react';
import { useJoinRequests, markJoinRequest, markAllJoinRequestsRead, deleteJoinRequest } from '../data/joinRequests';

const fmt = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

function exportCsv(list) {
  const cols = ['name', 'email', 'usn', 'year', 'department', 'message', 'status', 'createdAt'];
  const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const csv = [cols.join(','), ...list.map(r => cols.map(c => esc(r[c])).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `cipher-join-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function JoinRequests() {
  const requests = useJoinRequests();
  const [filter, setFilter] = useState('all');
  const unread = requests.filter(r => r.status === 'new').length;
  const shown = requests.filter(r => filter === 'all' || r.status === filter);

  return <div className="admin-page">
    <div className="admin-page-head"><div><div className="admin-kicker">// RECRUITMENT / INBOX</div><h1>Join Requests</h1><p>Applications submitted through the public Join form. {unread ? `${unread} new.` : 'No new requests.'}</p></div></div>
    <div className="jr-toolbar">
      {['all', 'new', 'read'].map(f => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f.toUpperCase()}{f === 'new' && unread ? ` (${unread})` : ''}</button>)}
      <span />
      <button onClick={markAllJoinRequestsRead} disabled={!unread}>MARK ALL READ</button>
      <button onClick={() => exportCsv(requests)} disabled={!requests.length}>EXPORT CSV</button>
    </div>
    {!shown.length && <div className="jr-empty">// NO REQUESTS TO SHOW</div>}
    <div className="jr-list">
      {shown.map(r => (
        <article key={r.id} className={`jr-card ${r.status === 'new' ? 'is-new' : ''}`}>
          <header>
            <div><h3>{r.name}</h3><small>{fmt(r.createdAt)}</small></div>
            {r.status === 'new' && <span className="jr-badge">NEW</span>}
          </header>
          <dl>
            <div><dt>USN</dt><dd>{r.usn}</dd></div>
            <div><dt>YEAR</dt><dd>{r.year}</dd></div>
            <div><dt>DEPARTMENT</dt><dd>{r.department}</dd></div>
            <div><dt>EMAIL</dt><dd><a href={`mailto:${r.email}`}>{r.email}</a></dd></div>
          </dl>
          <p>{r.message}</p>
          <footer>
            {r.status === 'new'
              ? <button onClick={() => markJoinRequest(r.id, 'read')}>MARK AS READ</button>
              : <button onClick={() => markJoinRequest(r.id, 'new')}>MARK AS NEW</button>}
            <a className="jr-reply" href={`mailto:${r.email}?subject=CIPHER%20application`}>REPLY</a>
            <button className="danger" onClick={() => window.confirm(`Delete request from ${r.name}?`) && deleteJoinRequest(r.id)}>DELETE</button>
          </footer>
        </article>
      ))}
    </div>
  </div>;
}
