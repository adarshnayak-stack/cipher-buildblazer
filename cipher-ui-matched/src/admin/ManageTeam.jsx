import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { saveTeam } from '../data/contentStore';
import ImageUploader from './ImageUploader';

const blank = { name: '', role: '', year: '', image: '', linkedin: '', github: '', bio: '', group: 'officeBearers' };

export default function ManageTeam() {
  const { content } = useContent();
  const team = content.team;
  const members = [...(team.officeBearers || []).map(m => ({ ...m, group: 'officeBearers' })), ...(team.coreTeam || []).map(m => ({ ...m, group: 'coreTeam' }))];
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  const field = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const openAdd = () => { setEditing('new'); setForm(blank); };
  const openEdit = m => { setEditing(m.id); setForm({ ...blank, ...m }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const persist = next => saveTeam({ faculty: next.faculty || team.faculty || [], officeBearers: next.officeBearers || [], coreTeam: next.coreTeam || [] });

  const save = e => {
    e.preventDefault();
    const id = form.id || `member-${Date.now()}`;
    const member = { id, name: form.name.trim(), role: form.role.trim(), year: form.year.trim(), image: form.image, linkedin: form.linkedin.trim(), github: form.github.trim(), bio: form.bio.trim() };
    let office = [...(team.officeBearers || [])];
    let core = [...(team.coreTeam || [])];
    if (editing === 'new') {
      (form.group === 'coreTeam' ? core : office).push(member);
    } else {
      office = office.map(m => m.id === editing ? member : m);
      core = core.map(m => m.id === editing ? member : m);
    }
    persist({ officeBearers: office, coreTeam: core });
    setEditing(null); setForm(blank); setNotice(editing === 'new' ? 'Member added.' : 'Member updated.');
    setTimeout(() => setNotice(''), 2200);
  };

  const remove = member => {
    if (!window.confirm(`Remove ${member.name} from the public leadership page?`)) return;
    const office = (team.officeBearers || []).filter(m => m.id !== member.id);
    const core = (team.coreTeam || []).filter(m => m.id !== member.id);
    persist({ officeBearers: office, coreTeam: core });
    setNotice('Member removed.'); setTimeout(() => setNotice(''), 2200);
  };

  return <div className="admin-page">
    <div className="admin-page-head"><div><div className="admin-kicker">// CONTENT / LEADERSHIP</div><h1>Manage Leadership</h1><p>Add, edit or remove people shown on the public Leadership page.</p></div><button className="admin-primary small" onClick={openAdd}>+ ADD MEMBER</button></div>
    {notice && <div className="admin-success">✓ {notice}</div>}
    {editing && <form className="admin-editor" onSubmit={save}>
      <div className="admin-editor-head"><h2>{editing === 'new' ? 'Add Member' : 'Edit Member'}</h2><button type="button" onClick={() => setEditing(null)}>×</button></div>
      <div className="admin-form-grid">
        <label>FULL NAME<input required value={form.name} onChange={e => field('name', e.target.value)} /></label>
        <label>ROLE<input required value={form.role} onChange={e => field('role', e.target.value)} /></label>
        <label>YEAR<input value={form.year} onChange={e => field('year', e.target.value)} placeholder="3rd Year, CSE" /></label>
        <label>SECTION<select value={form.group} onChange={e => field('group', e.target.value)}><option value="officeBearers">Office Bearer</option><option value="coreTeam">Core Team</option></select></label>
        <div className="full"><ImageUploader label="PHOTO" round value={form.image} onChange={v => field('image', v)} /></div>
        <label>LINKEDIN<input value={form.linkedin} onChange={e => field('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." /></label>
        <label>GITHUB<input value={form.github} onChange={e => field('github', e.target.value)} placeholder="https://github.com/..." /></label>
        <label className="full">BIO<textarea rows="4" value={form.bio} onChange={e => field('bio', e.target.value)} /></label>
      </div>
      <div className="admin-editor-actions"><button type="button" className="admin-secondary" onClick={() => setEditing(null)}>CANCEL</button><button className="admin-primary" type="submit">SAVE MEMBER →</button></div>
    </form>}
    <div className="admin-list">
      {members.map(member => <article key={member.id} className="admin-list-item">
        <div className="admin-list-image round">{member.image ? <img src={member.image} alt="" /> : <span>NO IMAGE</span>}</div>
        <div className="admin-list-copy"><div><span className="admin-badge">{member.group === 'coreTeam' ? 'CORE TEAM' : 'OFFICE BEARER'}</span><span className="admin-muted">{member.role}</span></div><h3>{member.name}</h3><p>{member.year || 'CSE'} · {member.bio || 'No biography added.'}</p></div>
        <div className="admin-list-actions"><button onClick={() => openEdit(member)}>EDIT</button><button className="danger" onClick={() => remove(member)}>DELETE</button></div>
      </article>)}
    </div>
  </div>;
}
