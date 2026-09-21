import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { addJoinRequest } from '../data/joinRequests';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const DEPARTMENTS = ['CSE', 'CSE (AI & ML)', 'CSE (Cyber Security)', 'ISE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'];
const empty = { name: '', email: '', usn: '', year: '', department: '', message: '' };

export default function JoinForm({ onDone, heading = false }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const f = { ...form, name: form.name.trim(), email: form.email.trim(), usn: form.usn.trim().toUpperCase(), message: form.message.trim() };
    if (!f.name) return setError('NAME IS REQUIRED.');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setError('ENTER A VALID EMAIL.');
    if (!/^[A-Z0-9]{6,15}$/.test(f.usn)) return setError('ENTER A VALID USN (LETTERS/NUMBERS ONLY).');
    if (!f.year) return setError('SELECT YOUR YEAR OF STUDY.');
    if (!f.department) return setError('SELECT YOUR DEPARTMENT.');
    if (!f.message) return setError('MESSAGE IS REQUIRED.');
    setError('');
    setBusy(true);
    try { await addJoinRequest(f); setSent(true); }
    catch (err) { setError(err.message || 'COULD NOT SAVE REQUEST. TRY AGAIN.'); }
    finally { setBusy(false); }
  };

  if (sent) {
    return (
      <div className="join-success">
        <div className="success-mark">✓</div>
        <h2>REQUEST SENT</h2>
        <p>Your application has been sent to the CIPHER admin team. They will contact you on the email you provided.</p>
        <button className="btn outline" type="button" onClick={() => (onDone ? onDone() : (setForm(empty), setSent(false)))}>
          {onDone ? 'CLOSE' : 'SEND ANOTHER'}
        </button>
      </div>
    );
  }

  return (
    <form className="join-form" onSubmit={submit} noValidate>
      {heading && <><div className="eyebrow">// ACCESS REQUEST</div><h2>Join the Team</h2></>}
      <label>FULL NAME<input value={form.name} onChange={set('name')} placeholder="Your name" autoComplete="name" /></label>
      <label>EMAIL<input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" /></label>
      <label>USN<input value={form.usn} onChange={set('usn')} placeholder="e.g. 4SO23CS001" autoCapitalize="characters" /></label>
      <div className="join-row">
        <label>YEAR OF STUDY
          <select value={form.year} onChange={set('year')}>
            <option value="">Select year</option>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </label>
        <label>DEPARTMENT
          <select value={form.department} onChange={set('department')}>
            <option value="">Select department</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </label>
      </div>
      <label>MESSAGE<textarea rows="4" value={form.message} onChange={set('message')} placeholder="Tell CIPHER why you want to join..." /></label>
      {error && <div className="form-error">! {error}</div>}
      <button className="btn primary" type="submit" disabled={busy}>
  {busy ? "SUBMITTING…" : <>SUBMIT REQUEST <ArrowRight size={16} /></>}
</button>
    </form>
  );
}
