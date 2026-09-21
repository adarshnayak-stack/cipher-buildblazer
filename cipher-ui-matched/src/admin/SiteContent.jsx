import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { saveContent } from '../data/contentStore';
import ImageUploader from './ImageUploader';
import defaultLogo from '../assets/cipher-logo.png';

export default function SiteContent() {
  const { content } = useContent();
  const [form, setForm] = useState({
    logo: content.site.logo || '',
    email: content.site.contact?.email || '',
    instagram: content.site.contact?.socials?.instagram || '',
    linkedin: content.site.contact?.socials?.linkedin || '',
    github: content.site.contact?.socials?.github || '',
  });
  const [notice, setNotice] = useState('');

  const field = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const save = e => {
    e.preventDefault();
    const next = {
      ...content,
      site: {
        ...content.site,
        logo: form.logo,
        contact: { ...content.site.contact, email: form.email, socials: { ...(content.site.contact?.socials || {}), instagram: form.instagram, linkedin: form.linkedin, github: form.github } }
      }
    };
    saveContent(next);
    setNotice('Site content updated.');
    setTimeout(() => setNotice(''), 2200);
  };

  return <div className="admin-page">
    <div className="admin-page-head"><div><div className="admin-kicker">// CONTENT / WEBSITE</div><h1>Site Content</h1><p>Edit contact details and social links used by the public pages. No React code required.</p></div></div>
    {notice && <div className="admin-success">✓ {notice}</div>}
    <form className="admin-editor always" onSubmit={save}>
      <div className="admin-section-label">BRANDING — LOGO</div>
      <div className="admin-form-grid">
        <div className="full">
          <ImageUploader label="CIPHER LOGO (shown in the website header)" keepAlpha value={form.logo || defaultLogo} onChange={v => field('logo', v)} />
          {form.logo && <button type="button" className="admin-ghost" style={{ marginTop: 10 }} onClick={() => field('logo', '')}>↺ USE DEFAULT LOGO</button>}
          <span className="help">Tip: a PNG with a transparent background looks best. Click SAVE below to publish.</span>
        </div>
      </div>
      <div className="admin-section-label">CONTACT & SOCIALS</div>
      <div className="admin-form-grid">
        <label className="full">PUBLIC EMAIL<input value={form.email} onChange={e => field('email', e.target.value)} /></label>
        <label>INSTAGRAM<input value={form.instagram} onChange={e => field('instagram', e.target.value)} /></label>
        <label>LINKEDIN<input value={form.linkedin} onChange={e => field('linkedin', e.target.value)} /></label>
        <label className="full">GITHUB<input value={form.github} onChange={e => field('github', e.target.value)} /></label>
      </div>
      <div className="admin-editor-actions"><button className="admin-primary" type="submit">SAVE SITE CONTENT →</button></div>
    </form>
  </div>;
}
