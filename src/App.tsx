/**
 * Habitly — Main Application Component
 * 
 * A minimalist habit tracker that helps you answer one question:
 * "Did I do the habits I care about today?"
 */

import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Profile from './pages/Profile';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'signup'

  // Loading state
  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  // Not authenticated — show auth pages
  if (!isAuthenticated) {
    if (authPage === 'signup') {
      return <Signup onSwitchToLogin={() => setAuthPage('login')} />;
    }
    return <Login onSwitchToSignup={() => setAuthPage('signup')} />;
  }

  // Authenticated — show app
  const renderPage = () => {
    switch (currentPage) {
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="app-main">
        {renderPage()}
      </main>
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
