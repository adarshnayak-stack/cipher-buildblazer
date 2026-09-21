import React, { useMemo, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { saveEvents } from '../data/contentStore';
import ImageUploader from './ImageUploader';

const emptyEvent = {
  id: '', title: '', slug: '', category: 'WORKSHOP', status: 'upcoming', date: '', time: '', location: '', shortDescription: '', fullDescription: '', image: '', galleryImages: [], registrationLink: ''
};

function toForm(event) { return { ...event, galleryImages: event.galleryImages || [] }; }

export default function ManageEvents() {
  const { content } = useContent();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [notice, setNotice] = useState('');
  const events = content.events;

  const openAdd = () => { setEditing('new'); setForm(emptyEvent); };
  const openEdit = e => { setEditing(e.id); setForm(toForm(e)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const field = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const save = e => {
    e.preventDefault();
    const id = form.id || `e-${Date.now()}`;
    const normalized = {
      ...form,
      image: form.image || (form.galleryImages || [])[0] || '',
      id,
      slug: form.slug || form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      galleryImages: form.galleryImages || [],
    };
    const next = editing === 'new' ? [...events, normalized] : events.map(item => item.id === editing ? normalized : item);
    saveEvents(next);
    setEditing(null);
    setNotice(editing === 'new' ? 'Event added to the website.' : 'Event updated successfully.');
    setTimeout(() => setNotice(''), 2200);
  };

  const remove = id => {
    if (!window.confirm('Remove this event from the public website?')) return;
    saveEvents(events.filter(e => e.id !== id));
    setNotice('Event removed.');
    setTimeout(() => setNotice(''), 2200);
  };

  return <div className="admin-page">
    <div className="admin-page-head"><div><div className="admin-kicker">// CONTENT / EVENTS</div><h1>Manage Events</h1><p>Everything here is editable by the club lead. No code changes are required.</p></div><button className="admin-primary small" onClick={openAdd}>+ ADD EVENT</button></div>
    {notice && <div className="admin-success">✓ {notice}</div>}
    {editing && <form className="admin-editor" onSubmit={save}>
      <div className="admin-editor-head"><h2>{editing === 'new' ? 'Create Event' : 'Edit Event'}</h2><button type="button" onClick={() => setEditing(null)}>×</button></div>
      <div className="admin-form-grid">
        <label>EVENT TITLE<input required value={form.title} onChange={e => field('title', e.target.value)} /></label>
        <label>CATEGORY<input required value={form.category} onChange={e => field('category', e.target.value)} placeholder="WORKSHOP / COMPETITION" /></label>
        <label>DATE<input required type="date" value={form.date} onChange={e => field('date', e.target.value)} /></label>
        <label>TIME<input value={form.time} onChange={e => field('time', e.target.value)} /></label>
        <label>LOCATION<input value={form.location} onChange={e => field('location', e.target.value)} /></label>
        <label>STATUS<select value={form.status} onChange={e => field('status', e.target.value)}><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></label>
        <div className="full"><ImageUploader label="MAIN IMAGE" value={form.image} onChange={v => field('image', v)} /></div>
        <div className="full"><ImageUploader label="GALLERY IMAGES" multiple value={form.galleryImages || []} onChange={v => field('galleryImages', v)} /></div>
        <label className="full">SHORT DESCRIPTION<textarea rows="3" value={form.shortDescription} onChange={e => field('shortDescription', e.target.value)} /></label>
        <label className="full">FULL DESCRIPTION<textarea rows="7" value={form.fullDescription} onChange={e => field('fullDescription', e.target.value)} /></label>
        <label className="full">REGISTRATION LINK<input value={form.registrationLink} onChange={e => field('registrationLink', e.target.value)} placeholder="https://forms.google.com/..." /></label>
      </div>
      <div className="admin-editor-actions"><button type="button" className="admin-secondary" onClick={() => setEditing(null)}>CANCEL</button><button className="admin-primary" type="submit">SAVE EVENT →</button></div>
    </form>}

    <div className="admin-list">
      {events.map(event => <article key={event.id} className="admin-list-item">
        <div className="admin-list-image">{event.image ? <img src={event.image} alt="" /> : <span>NO IMAGE</span>}</div>
        <div className="admin-list-copy"><div><span className="admin-badge">{event.status}</span><span className="admin-muted">{event.category} · {event.date}</span></div><h3>{event.title}</h3><p>{event.shortDescription}</p></div>
        <div className="admin-list-actions"><button onClick={() => openEdit(event)}>EDIT</button><button className="danger" onClick={() => remove(event.id)}>DELETE</button></div>
      </article>)}
    </div>
  </div>;
}
