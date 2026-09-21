import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { loginAdmin, isAdminAuthenticated } from './auth';

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAdminAuthenticated()) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const ok = await loginAdmin(password);
      if (!ok) throw new Error('Invalid admin password.');
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-auth-screen">
      <div className="admin-auth-card">
        <div className="admin-kicker">// CIPHER PRIVATE CMS</div>
        <h1>Admin Login</h1>
        <p>Restricted area for the club lead. Enter the admin password to continue.</p>
        <form onSubmit={submit} className="admin-form">
          <label>
            ADMIN PASSWORD
            <input
              type="password"
              minLength={8}
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </label>
          {error && <div className="admin-error">{error}</div>}
          <button disabled={busy} className="admin-primary" type="submit">
            {busy ? 'AUTHENTICATING…' : 'ENTER ADMIN →'}
          </button>
        </form>
        <button className="admin-text-button" onClick={() => navigate('/')}>
          ← Return to public website
        </button>
      </div>
    </div>
  );
}
