/**
 * Habitly — Main Application Component
 * 
 * Complete app with sidebar navigation, dark mode, and all pages
 */

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Stats from './pages/Stats';
import Coach from './pages/Coach';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// SVG Icons
const Icons = {
  leaf: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" x2="18" y1="20" y2="10"/>
      <line x1="12" x2="12" y1="20" y2="4"/>
      <line x1="6" x2="6" y1="20" y2="14"/>
    </svg>
  ),
  bot: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16,17 21,12 16,7"/>
      <line x1="21" x2="9" y1="12" y2="12"/>
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
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  ),
  plus: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  ),
};

function AppContent() {
  const { user, loading, isAuthenticated, signOut } = useAuth();
  const [showLanding, setShowLanding] = useState(() => {
    return !localStorage.getItem('habitly-seen-landing');
  });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authPage, setAuthPage] = useState('login');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('habitly-dark') === 'true';
    }
    return false;
  });

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('habitly-dark', darkMode);
  }, [darkMode]);

  // Loading state
  if (loading) {
    return (
      <div className="loading-page">
        <div className="spin spin-lg" />
      </div>
    );
  }

  // Show landing page first time
  if (showLanding && !isAuthenticated) {
    return (
      <Landing 
        onGetStarted={() => {
          localStorage.setItem('habitly-seen-landing', 'true');
          setShowLanding(false);
        }} 
      />
    );
  }

  // Not authenticated — show auth pages
  if (!isAuthenticated) {
    if (authPage === 'signup') {
      return <Signup onSwitchToLogin={() => setAuthPage('login')} />;
    }
    return <Login onSwitchToSignup={() => setAuthPage('signup')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'history':
        return <History />;
      case 'stats':
        return <Stats />;
      case 'coach':
        return <Coach />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'history': return 'History';
      case 'stats': return 'Statistics';
      case 'coach': return 'AI Coach';
      case 'profile': return 'Profile';
      case 'settings': return 'Settings';
      default: return 'Today';
    }
  };

  return (
    <div className="app">
      {/* Sidebar (desktop) */}
      <aside className="side">
        <div className="side-logo">
          <span style={{ color: 'var(--leaf)' }}>{Icons.leaf}</span>
          <b>Habitly</b>
        </div>
        
        <nav className="side-nav">
          <button 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            {Icons.home}
            <span>Today</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentPage('history')}
          >
            {Icons.calendar}
            <span>History</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'stats' ? 'active' : ''}`}
            onClick={() => setCurrentPage('stats')}
          >
            {Icons.chart}
            <span>Statistics</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'coach' ? 'active' : ''}`}
            onClick={() => setCurrentPage('coach')}
          >
            {Icons.bot}
            <span>AI Coach</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentPage('profile')}
          >
            {Icons.user}
            <span>Profile</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            {Icons.settings}
            <span>Settings</span>
          </button>
        </nav>
        
        <div className="side-foot stack-s">
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)} 
            aria-label="Toggle theme"
          >
            {darkMode ? Icons.sun : Icons.moon}
          </button>
          <button className="nav-item" onClick={signOut}>
            {Icons.logout}
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main">
        {/* Top bar */}
        <header className="topbar">
          <div className="grow">
            <div className="topbar-title">{getPageTitle()}</div>
          </div>
          <div className="topbar-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </header>

        {/* Page content */}
        <div className="content">
          {renderPage()}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        <button 
          className={`mnav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentPage('dashboard')}
        >
          {Icons.home}
          <span>Today</span>
        </button>
        <button 
          className={`mnav-item ${currentPage === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentPage('history')}
        >
          {Icons.calendar}
          <span>History</span>
        </button>
        <button 
          className={`mnav-item ${currentPage === 'stats' ? 'active' : ''}`}
          onClick={() => setCurrentPage('stats')}
        >
          {Icons.chart}
          <span>Stats</span>
        </button>
        <button 
          className={`mnav-item ${currentPage === 'coach' ? 'active' : ''}`}
          onClick={() => setCurrentPage('coach')}
        >
          {Icons.bot}
          <span>Coach</span>
        </button>
        <button 
          className={`mnav-item ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentPage('profile')}
        >
          {Icons.user}
          <span>Profile</span>
        </button>
      </nav>

      {/* FAB for mobile */}
      <button 
        className="fab" 
        aria-label="Add habit"
        onClick={() => setCurrentPage('dashboard')}
      >
        {Icons.plus}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
