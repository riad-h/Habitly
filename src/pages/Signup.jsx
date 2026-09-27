/**
 * Signup page — Split layout with brand panel
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validation';

const Icons = {
  leaf: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  flame: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  ),
  cloud: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
  ),
  sparkle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  ),
};

export default function Signup({ onSwitchToLogin }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) { setError(emailCheck.error); return; }
    
    const passCheck = validatePassword(password);
    if (!passCheck.valid) { setError(passCheck.error); return; }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);
    
    if (result.error) {
      setError(result.error.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-shell">
      {/* Brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-logo">
          <span style={{ color: '#f0c568' }}>{Icons.leaf}</span>
          <b>Habitly</b>
        </div>
        
        <div>
          <h1 className="auth-headline">
            Start your journey.<br/>
            <em>Small steps, big changes.</em>
          </h1>
          <p className="auth-sub">
            Join thousands building better habits. Track your progress, maintain streaks, and get personalized AI insights.
          </p>
          
          <div className="auth-feats">
            <div className="auth-feat">
              <span className="auth-feat-ic">{Icons.check}</span>
              One-tap daily check-ins & measurable targets
            </div>
            <div className="auth-feat">
              <span className="auth-feat-ic">{Icons.flame}</span>
              Streaks that survive real life — skip, don't break
            </div>
            <div className="auth-feat">
              <span className="auth-feat-ic">{Icons.sparkle}</span>
              Private AI insights computed from your own history
            </div>
            <div className="auth-feat">
              <span className="auth-feat-ic">{Icons.cloud}</span>
              Synced to Supabase — your data follows your account
            </div>
          </div>
        </div>
        
        <p style={{ position: 'relative', zIndex: 2, fontSize: '12px', color: '#8b9a8a' }}>
          Small actions · Consistent progress · Better habits
        </p>
      </div>

      {/* Form panel */}
      <div className="auth-form-wrap">
        <div className="auth-card card">
          <div className="auth-mobile-logo">
            <span style={{ color: 'var(--leaf)' }}>{Icons.leaf}</span>
            <b>Habitly</b>
          </div>
          
          <h2 className="h2" style={{ marginBottom: '4px' }}>Create your account</h2>
          <p className="muted" style={{ fontSize: '14px', marginBottom: '20px' }}>
            Start building better habits today.
          </p>
          
          <form onSubmit={handleSubmit} className="stack-s">
            {error && (
              <div className="form-err">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                {error}
              </div>
            )}
            
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
              />
            </div>
            
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            </div>
            
            <div>
              <label className="label" htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? (
                <><span className="spin" /> Creating account...</>
              ) : 'Create account'}
            </button>
          </form>
          
          <p className="auth-alt" style={{ marginTop: '20px' }}>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
