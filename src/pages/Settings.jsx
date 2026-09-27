/**
 * Settings page — Theme, reminders, and preferences
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Icons = {
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  trash: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  ),
};

export default function Settings() {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('habitly-dark') === 'true';
  });
  const [reminders, setReminders] = useState(() => {
    return localStorage.getItem('habitly-reminders') === 'true';
  });
  const [reminderTime, setReminderTime] = useState(() => {
    return localStorage.getItem('habitly-reminder-time') || '09:00';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('habitly-dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('habitly-reminders', reminders);
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('habitly-reminder-time', reminderTime);
  }, [reminderTime]);

  const handleClearData = () => {
    if (confirm('Are you sure? This will delete all your habits and data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 className="h1" style={{ marginBottom: '20px' }}>Settings</h1>

      {/* Appearance */}
      <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
        <div className="tag" style={{ marginBottom: '16px' }}>Appearance</div>
        
        <div className="row spread" style={{ marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>Dark mode</div>
            <div className="muted" style={{ fontSize: '13px' }}>Use dark theme</div>
          </div>
          <button
            className="switch"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            <div className={`switch-knob ${darkMode ? 'on' : ''}`} style={{ left: darkMode ? '23px' : '3px' }} />
            <style>{`
              .switch { position: relative; width: 46px; height: 26px; border-radius: 999px; border: none; cursor: pointer; background: ${darkMode ? 'var(--leaf)' : 'var(--line2)'}; transition: background 0.2s ease; }
              .switch-knob { position: absolute; top: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: left 0.2s ease; }
            `}</style>
          </button>
        </div>
      </div>

      {/* Reminders */}
      <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
        <div className="tag" style={{ marginBottom: '16px' }}>Reminders</div>
        
        <div className="row spread" style={{ marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>Daily reminders</div>
            <div className="muted" style={{ fontSize: '13px' }}>Get notified to complete your habits</div>
          </div>
          <button
            className="switch"
            onClick={() => setReminders(!reminders)}
            aria-label="Toggle reminders"
          >
            <div className={`switch-knob ${reminders ? 'on' : ''}`} style={{ left: reminders ? '23px' : '3px' }} />
          </button>
        </div>

        {reminders && (
          <div>
            <label className="label" htmlFor="reminder-time">Reminder time</label>
            <input
              id="reminder-time"
              type="time"
              className="input"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
            <p className="muted" style={{ fontSize: '12px', marginTop: '6px' }}>
              You'll receive a daily reminder at this time
            </p>
          </div>
        )}
      </div>

      {/* Account */}
      <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
        <div className="tag" style={{ marginBottom: '16px' }}>Account</div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>
            {user?.display_name || user?.email?.split('@')[0] || 'User'}
          </div>
          <div className="muted" style={{ fontSize: '13px' }}>{user?.email}</div>
        </div>

        <button className="btn btn-ghost w-full" onClick={signOut} style={{ marginBottom: '8px' }}>
          Sign out
        </button>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ padding: '20px', borderColor: 'var(--coral-soft)' }}>
        <div className="tag" style={{ marginBottom: '16px', color: 'var(--coral)' }}>Danger zone</div>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>Clear all data</div>
          <div className="muted" style={{ fontSize: '13px' }}>
            Delete all habits and completion history
          </div>
        </div>

        <button className="btn btn-danger w-full" onClick={handleClearData}>
          {Icons.trash}
          Clear all data
        </button>
      </div>
    </div>
  );
}
