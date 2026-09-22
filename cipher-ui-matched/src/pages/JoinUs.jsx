import React, { useState } from 'react';

export default function JoinUs() {
  const [form, setForm] = useState({ name: '', email: '', year: '2nd Year', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setErrorMsg('Name cannot be empty.');
    if (!form.email.includes('@')) return setErrorMsg('Valid college email required.');
    if (!form.message.trim()) return setErrorMsg('Message cannot be empty.');

    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '120px 8vw 6rem 8vw' }}>
      <div style={{ color: 'var(--green-primary)', fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>// RECRUITMENT REPOSITORY</div>
      <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', marginBottom: '3rem', fontFamily: 'var(--font-sans)' }}>Join CIPHER</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
        <div>
          <h3 style={{ color: 'var(--green-primary)', marginBottom: '1.2rem', fontSize: '1.5rem' }}>Why Join CIPHER?</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
            <li>&gt; Build production-ready software and participate in national hackathons.</li>
            <li>&gt; Gain direct mentorship from seniors on competitive programming and system designs.</li>
            <li>&gt; Organize department-level technical symposiums and lead workshop tracks.</li>
          </ul>

          <h3 style={{ color: 'var(--green-primary)', margin: '2.5rem 0 1.2rem 0', fontSize: '1.5rem' }}>Eligibility &amp; Process</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Open to all enrolled students within the Department of Computer Science &amp; Engineering at St. Joseph Engineering College.
          </p>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            1. Submit Application → 2. Technical Screening → 3. Domain Allocation
          </div>
        </div>

        {/* Application Form */}
        <div className="hud-panel" style={{ padding: '2.5rem' }}>
          <h4 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)' }}>Candidate Application</h4>
          {submitted ? (
            <div style={{ color: 'var(--green-primary)', textAlign: 'center', padding: '3rem 0' }}>
              &gt; ACCESS REQUEST RECORDED. WELCOME TO CIPHER.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>NAME</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,255,102,0.04)', border: '1px solid var(--green-border)', color: '#fff', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>EMAIL</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@sjec.ac.in"
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,255,102,0.04)', border: '1px solid var(--green-border)', color: '#fff', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>YEAR OF STUDY</label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#050f08', border: '1px solid var(--green-border)', color: '#fff', borderRadius: '4px', outline: 'none' }}
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>STATEMENT OF INTENT</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Why would you like to join?"
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,255,102,0.04)', border: '1px solid var(--green-border)', color: '#fff', borderRadius: '4px', outline: 'none', resize: 'none' }}
                />
              </div>

              {errorMsg && <div style={{ color: '#ff4444', fontSize: '0.8rem' }}>! {errorMsg}</div>}

              <button type="submit" className="btn-cyber-solid" style={{ justifyContent: 'center' }}>
                APPLY NOW →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}