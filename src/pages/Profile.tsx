/**
 * Profile page — user account info
 */

import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { habits } = useHabits();

  const displayName = user?.display_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const createdDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <div>
      <h1 className="dashboard-greeting" style={{ marginBottom: '1.5rem' }}>Profile</h1>
      
      <div className="profile-card">
        <div className="profile-name">{displayName}</div>
        <div className="profile-email">{email}</div>
        <div className="profile-meta">
          Member since {createdDate}
        </div>
      </div>

      <div className="profile-card">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>Your stats</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span className="text-muted">Active habits</span>
            <span style={{ fontWeight: 500 }}>{habits.length}</span>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>About Habitly</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Habitly is a minimalist habit tracker designed to help you build consistency. 
          Track your daily habits, view your streaks, and let AI suggest new habits to try.
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
          Version 1.0.0
        </p>
      </div>

      <button className="btn btn-secondary btn-full" onClick={signOut} style={{ marginTop: '0.5rem' }}>
        Sign out
      </button>
    </div>
  );
}
