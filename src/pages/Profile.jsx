/**
 * Profile page — user account info (HabitFlow design)
 */

import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';

const Icons = {
  leaf: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16,17 21,12 16,7"/>
      <line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  ),
};

export default function Profile() {
  const { user, signOut } = useAuth();
  const { habits } = useHabits();

  const displayName = user?.display_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();
  const createdDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <div>
      <h1 className="h1" style={{ marginBottom: '20px' }}>Profile</h1>
      
      {/* User info card */}
      <div className="card profile-card" style={{ marginBottom: '16px' }}>
        <div className="row" style={{ marginBottom: '16px' }}>
          <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '22px' }}>
            {initial}
          </div>
          <div>
            <div className="profile-name">{displayName}</div>
            <div className="profile-email">{email}</div>
          </div>
        </div>
        <div className="profile-meta">
          Member since {createdDate}
        </div>
      </div>

      {/* Stats card */}
      <div className="card profile-card" style={{ marginBottom: '16px' }}>
        <div className="tag" style={{ marginBottom: '12px' }}>Your stats</div>
        <div className="row spread">
          <span className="soft" style={{ fontSize: '14px' }}>Active habits</span>
          <span className="num" style={{ fontSize: '20px', color: 'var(--leaf)' }}>{habits.length}</span>
        </div>
      </div>

      {/* About card */}
      <div className="card profile-card" style={{ marginBottom: '16px' }}>
        <div className="tag" style={{ marginBottom: '12px' }}>About Habitly</div>
        <p className="soft" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '8px' }}>
          A calm, data-driven habit tracker. Build streaks, track progress, and get AI-powered insights.
        </p>
        <p className="muted" style={{ fontSize: '12px' }}>Version 1.0.0</p>
      </div>

      {/* Sign out */}
      <button className="btn btn-ghost w-full" onClick={signOut}>
        {Icons.logout}
        Sign out
      </button>
    </div>
  );
}
