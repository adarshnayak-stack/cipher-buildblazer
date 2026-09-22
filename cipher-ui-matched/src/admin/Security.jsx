import React, { useState } from 'react';
import { apiPost } from '../data/api';

export default function Security() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setNotice('');
    if (form.newPassword.length < 8) return setError('New password must be at least 8 characters.');
    if (form.newPassword !== form.confirmPassword) return setError('New passwords do not match.');
    setBusy(true);
    try {
      await apiPost('/api/auth/change-password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setNotice('Password changed successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { setError(err.message || 'Could not change password.'); }
    finally { setBusy(false); }
  };

  return <div className="admin-page">
    <div className="admin-page-head"><div><div className="admin-kicker">// SECURITY</div><h1>Admin Security</h1><p>Change the admin password. The password is stored only as a bcrypt hash in PostgreSQL.</p></div></div>
    <div className="admin-editor" style={{maxWidth:560}}>
      <h2>Change Password</h2>
      <form className="admin-form" onSubmit={submit}>
        <label>CURRENT PASSWORD<input type="password" required autoComplete="current-password" value={form.currentPassword} onChange={e=>setForm({...form,currentPassword:e.target.value})}/></label>
        <label>NEW PASSWORD<input type="password" required minLength={8} autoComplete="new-password" value={form.newPassword} onChange={e=>setForm({...form,newPassword:e.target.value})}/></label>
        <label>CONFIRM NEW PASSWORD<input type="password" required minLength={8} autoComplete="new-password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})}/></label>
        {error && <div className="admin-error">{error}</div>}
        {notice && <div className="admin-success">✓ {notice}</div>}
        <button className="admin-primary" disabled={busy} type="submit">{busy ? 'UPDATING…' : 'CHANGE PASSWORD →'}</button>
      </form>
      <p className="admin-muted" style={{marginTop:18}}>Forgot the password completely? Run <code>npm run admin:reset</code> from the backend folder. There is no public password-reset page.</p>
    </div>
  </div>;
}
