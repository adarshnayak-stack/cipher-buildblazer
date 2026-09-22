import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { saveContent } from '../data/contentStore';
import { normalizeActivity } from '../data/activities';
import { putVideo, listVideoIds, deleteVideo } from '../data/videoStore';

const lines = (arr) => (arr || []).join('\n');
const split = (str) => str.split('\n').map(s => s.trim()).filter(Boolean);
const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;

const TABS = [
  { id: 'home', label: 'HOME', path: '/', blurb: 'Everything shown on the homepage: hero, “Who we are” block, domains and the join section.' },
  { id: 'about', label: 'ABOUT US', path: '/about', blurb: 'All text on the About Us page.' },
  { id: 'leadership', label: 'LEADERSHIP', path: '/team', blurb: 'Heading and intro of the Leadership page. Add or edit the people themselves under Leadership in the sidebar.' },
  { id: 'events', label: 'EVENTS', path: '/events', blurb: 'Heading and intro of the Events page. Add or edit the events themselves under Events in the sidebar.' },
  { id: 'activities', label: 'ACTIVITIES', path: '/', blurb: 'The Activities list on the homepage. Give an activity a video and its arrow opens it in a popup on the same page.' },
];

function VideoField({ video, busy, onUpload, onLink, onClear }) {
  const ref = useRef(null);
  return <div className="act-video">
    <input ref={ref} type="file" accept="video/*" hidden onChange={e => { onUpload(e.target.files?.[0]); e.target.value = ''; }} />
    {video?.type === 'upload' ? (
      <div className="act-video-chip"><span>▶ {video.name}{video.size ? ` · ${mb(video.size)}` : ''}</span>
        <button type="button" onClick={() => ref.current?.click()}>REPLACE</button>
        <button type="button" className="danger" onClick={onClear}>REMOVE</button></div>
    ) : (
      <div className="act-video-pick">
        <button type="button" className="admin-secondary" disabled={busy} onClick={() => ref.current?.click()}>{busy ? 'UPLOADING…' : '⬆ UPLOAD VIDEO'}</button>
        <span>or</span>
        <input placeholder="paste a video link (YouTube, Vimeo, Drive or .mp4 URL)" value={video?.type === 'link' ? video.url : ''} onChange={e => onLink(e.target.value)} />
      </div>
    )}
  </div>;
}

export default function ManageAbout() {
  const { content } = useContent();
  const a = content.site.about || {};
  const h = content.site.home || {};
  const p = a.profile || {};
  const lp = content.site.leadership || {};
  const ep = content.site.events || {};
  const [tab, setTab] = useState('home');
  const [busyRow, setBusyRow] = useState(-1);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    heading: a.heading ?? '', intro: a.intro ?? '', title: a.title ?? '',
    description: a.description ?? '', homeSummary: a.homeSummary ?? '',
    mission: a.mission ?? '', vision: a.vision ?? '', objectives: lines(a.objectives),
    whatWeBuild: lines(a.whatWeBuild),
    identity: p.identity ?? '', focus: p.focus ?? '', environment: p.environment ?? '', status: p.status ?? '',
    heroEyebrow: h.heroEyebrow ?? '', heroTagline: h.heroTagline ?? '', heroText: h.heroText ?? '',
    domains: (h.domains || []).map(d => ({ ...d })),
    activitiesIntro: h.activitiesIntro ?? '', activities: (h.activities || []).map(normalizeActivity), joinText: h.joinText ?? '',
    lEyebrow: lp.eyebrow ?? '', lHeading: lp.heading ?? '', lIntro: lp.intro ?? '',
    eEyebrow: ep.eyebrow ?? '', eHeading: ep.heading ?? '', eIntro: ep.intro ?? '',
  });
  const [notice, setNotice] = useState('');
  const field = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const setDomain = (i, k, v) => setForm(prev => ({ ...prev, domains: prev.domains.map((d, idx) => idx === i ? { ...d, [k]: v } : d) }));
  const addDomain = () => setForm(prev => ({ ...prev, domains: [...prev.domains, { title: '', sessions: '', desc: '' }] }));
  const removeDomain = (i) => setForm(prev => ({ ...prev, domains: prev.domains.filter((_, idx) => idx !== i) }));

  const setAct = (i, patch) => setForm(prev => ({ ...prev, activities: prev.activities.map((x, idx) => idx === i ? { ...x, ...patch } : x) }));
  const addAct = () => setForm(prev => ({ ...prev, activities: [...prev.activities, { title: '', video: null }] }));
  const removeAct = (i) => setForm(prev => ({ ...prev, activities: prev.activities.filter((_, idx) => idx !== i) }));
  const moveAct = (i, d) => setForm(prev => {
    const j = i + d; if (j < 0 || j >= prev.activities.length) return prev;
    const next = [...prev.activities]; [next[i], next[j]] = [next[j], next[i]];
    return { ...prev, activities: next };
  });
  const uploadVideo = async (i, file) => {
    if (!file) return;
    setError('');
    if (!file.type.startsWith('video/')) return setError('Please choose a video file (MP4 or WebM recommended).');
    setBusyRow(i);
    try {
      const uploaded = await putVideo(null, file);
      setAct(i, { video: { type: 'upload', id: uploaded.id, url: uploaded.url, name: uploaded.name, size: uploaded.size } });
    } catch { setError('Could not store this video in the browser (storage may be full). Try a smaller file or paste a link instead.'); }
    setBusyRow(-1);
  };

  const save = e => {
    e.preventDefault();
    const t = (v) => v.trim();
    const activities = form.activities.map(x => ({ title: t(x.title), video: x.video?.type === 'link' && !t(x.video.url) ? null : x.video || null })).filter(x => x.title);
    saveContent({
      ...content,
      site: {
        ...content.site,
        about: {
          ...content.site.about,
          heading: t(form.heading), intro: t(form.intro), title: t(form.title),
          description: t(form.description), homeSummary: t(form.homeSummary),
          mission: t(form.mission), vision: t(form.vision),
          objectives: split(form.objectives), whatWeBuild: split(form.whatWeBuild),
          profile: { identity: t(form.identity), focus: t(form.focus), environment: t(form.environment), status: t(form.status) },
        },
        leadership: { eyebrow: t(form.lEyebrow), heading: t(form.lHeading), intro: t(form.lIntro) },
        events: { eyebrow: t(form.eEyebrow), heading: t(form.eHeading), intro: t(form.eIntro) },
        home: {
          ...content.site.home,
          heroEyebrow: t(form.heroEyebrow), heroTagline: t(form.heroTagline), heroText: t(form.heroText),
          domains: form.domains.map(d => ({ title: t(d.title), sessions: t(d.sessions), desc: t(d.desc) })).filter(d => d.title),
          activitiesIntro: t(form.activitiesIntro), activities, joinText: t(form.joinText),
        },
      },
    });
    // drop uploaded videos that no activity uses any more
    const keep = new Set(activities.filter(x => x.video?.type === 'upload').map(x => x.video.id));
    listVideoIds().then(ids => ids.filter(id => !keep.has(id)).forEach(id => deleteVideo(id))).catch(() => {});
    setNotice('Saved — the public pages now show your changes.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setNotice(''), 3200);
  };

  const input = (k, label, extra = {}) => <label className={extra.full ? 'full' : ''}>{label}{extra.help && <span className="help">{extra.help}</span>}<input value={form[k]} onChange={e => field(k, e.target.value)} /></label>;
  const area = (k, label, rows = 3, help) => <label className="full">{label}{help && <span className="help">{help}</span>}<textarea rows={rows} value={form[k]} onChange={e => field(k, e.target.value)} /></label>;
  const current = TABS.find(x => x.id === tab);

  return <div className="admin-page">
    <div className="admin-page-head"><div><div className="admin-kicker">// CONTENT / PAGES</div><h1>Pages &amp; Content</h1><p>Pick a page below and edit its text. One SAVE button publishes everything. No code changes required.</p></div></div>
    {notice && <div className="admin-success">✓ {notice}</div>}
    <div className="admin-tabs" role="tablist">{TABS.map(x => <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} className={tab === x.id ? 'active' : ''} onClick={() => setTab(x.id)}>{x.label}</button>)}</div>
    <form className="admin-editor always" onSubmit={save}>
      <div className="admin-tab-intro"><span>{current.blurb}</span><Link to={current.path} target="_blank">↗ VIEW PAGE</Link></div>

      {tab === 'home' && <>
        <div className="admin-section-label">HERO</div>
        <div className="admin-form-grid">
          {input('heroEyebrow', 'SMALL LABEL ABOVE TITLE', { full: true })}
          {input('heroTagline', 'TAGLINE', { full: true })}
          {area('heroText', 'HERO PARAGRAPH', 3)}
        </div>
        <div className="admin-section-label">“WHO WE ARE” BLOCK</div>
        <div className="admin-form-grid">
          {area('homeSummary', 'SHORT SUMMARY', 3, 'shown on the homepage; the full text lives under the About Us tab')}
        </div>
        <div className="admin-section-label">OUR DOMAINS</div>
        <div className="admin-form-grid">
          {form.domains.map((d, i) => <div className="full act-card" key={i}>
            <div className="act-card-head"><span className="admin-badge">DOMAIN {String(i + 1).padStart(2, '0')}</span><button type="button" className="admin-secondary" onClick={() => removeDomain(i)}>REMOVE</button></div>
            <div className="admin-form-grid">
              <label>TITLE<input value={d.title} onChange={e => setDomain(i, 'title', e.target.value)} /></label>
              <label>BADGE TEXT<input value={d.sessions} placeholder="5 SESSIONS" onChange={e => setDomain(i, 'sessions', e.target.value)} /></label>
              <label className="full">DESCRIPTION<textarea rows="3" value={d.desc} onChange={e => setDomain(i, 'desc', e.target.value)} /></label>
            </div>
          </div>)}
          <div className="full"><button type="button" className="admin-secondary" onClick={addDomain}>+ ADD DOMAIN</button></div>
        </div>
        <div className="admin-section-label">JOIN SECTION</div>
        <div className="admin-form-grid">{area('joinText', 'JOIN TEXT', 3)}</div>
      </>}

      {tab === 'about' && <>
        <div className="admin-section-label">PAGE HEADER</div>
        <div className="admin-form-grid">
          {input('heading', 'PAGE HEADING', { full: true })}
          {area('intro', 'INTRO PARAGRAPH', 4)}
        </div>
        <div className="admin-section-label">WHO WE ARE</div>
        <div className="admin-form-grid">
          {input('title', 'SECTION TITLE', { full: true })}
          {area('description', 'ABOUT DESCRIPTION', 5)}
        </div>
        <div className="admin-section-label">PROFILE CARD</div>
        <div className="admin-form-grid">
          {input('identity', 'IDENTITY')}{input('focus', 'FOCUS')}
          {input('environment', 'ENVIRONMENT')}{input('status', 'STATUS')}
        </div>
        <div className="admin-section-label">MISSION / VISION</div>
        <div className="admin-form-grid">
          <label>MISSION<textarea rows="5" value={form.mission} onChange={e => field('mission', e.target.value)} /></label>
          <label>VISION<textarea rows="5" value={form.vision} onChange={e => field('vision', e.target.value)} /></label>
        </div>
        <div className="admin-section-label">WHAT WE BUILD (CARDS)</div>
        <div className="admin-form-grid">{area('whatWeBuild', 'CARD TITLES', 4, 'one card per line')}</div>
        <div className="admin-section-label">OBJECTIVES</div>
        <div className="admin-form-grid">{area('objectives', 'OBJECTIVES', 6, 'one objective per line')}</div>
      </>}

      {tab === 'leadership' && <>
        <div className="admin-section-label">PAGE HEADER</div>
        <div className="admin-form-grid">
          {input('lEyebrow', 'SMALL LABEL ABOVE HEADING', { full: true })}
          {input('lHeading', 'PAGE HEADING', { full: true })}
          {area('lIntro', 'INTRO PARAGRAPH', 3, 'write {count} where the number of members should appear')}
        </div>
        <div className="admin-tab-intro"><span>Members, photos and roles →</span><Link to="/admin/team">OPEN LEADERSHIP MANAGER</Link></div>
      </>}

      {tab === 'events' && <>
        <div className="admin-section-label">PAGE HEADER</div>
        <div className="admin-form-grid">
          {input('eEyebrow', 'SMALL LABEL ABOVE HEADING', { full: true })}
          {input('eHeading', 'PAGE HEADING', { full: true })}
          {area('eIntro', 'INTRO PARAGRAPH', 3)}
        </div>
        <div className="admin-tab-intro"><span>Events, photos and galleries →</span><Link to="/admin/events">OPEN EVENTS MANAGER</Link></div>
      </>}

      {tab === 'activities' && <>
        <div className="admin-section-label">SECTION INTRO</div>
        <div className="admin-form-grid">{area('activitiesIntro', 'INTRO TEXT', 3)}</div>
        <div className="admin-section-label">ACTIVITY LIST &amp; VIDEOS</div>
        <p className="help" style={{ margin: '0 0 14px', color: '#4d7356', fontSize: 11 }}>The homepage shows the first 6 activities. Upload a video (or paste a link) and the arrow on that activity plays it in a popup.</p>
        {error && <div className="admin-error" style={{ marginBottom: 14 }}>{error}</div>}
        <div className="act-list">
          {form.activities.map((x, i) => <div className="act-card" key={i}>
            <div className="act-card-head">
              <span className="admin-badge">{String(i + 1).padStart(2, '0')}{i < 6 ? ' · ON HOMEPAGE' : ''}</span>
              <div className="act-tools">
                <button type="button" onClick={() => moveAct(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" onClick={() => moveAct(i, 1)} disabled={i === form.activities.length - 1} aria-label="Move down">↓</button>
                <button type="button" className="danger" onClick={() => removeAct(i)}>REMOVE</button>
              </div>
            </div>
            <div className="admin-form-grid">
              <label className="full">ACTIVITY NAME<input value={x.title} onChange={e => setAct(i, { title: e.target.value })} /></label>
              <div className="full"><span className="act-label">VIDEO</span>
                <VideoField video={x.video} busy={busyRow === i} onUpload={f => uploadVideo(i, f)}
                  onLink={v => setAct(i, { video: v ? { type: 'link', url: v } : null })} onClear={() => setAct(i, { video: null })} /></div>
            </div>
          </div>)}
          <div><button type="button" className="admin-secondary" onClick={addAct}>+ ADD ACTIVITY</button></div>
        </div>
      </>}

      <div className="admin-editor-actions admin-savebar"><button className="admin-primary" type="submit">SAVE ALL CHANGES →</button></div>
    </form>
  </div>;
}
