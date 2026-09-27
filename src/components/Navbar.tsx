/**
 * Navbar component — top navigation bar
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ currentPage, onNavigate }) {
  const { signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <span className="navbar-brand">Habitly</span>
      
      <button 
        className="navbar-toggle" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        ☰
      </button>
      
      <ul className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
        <li>
          <button 
            className={`navbar-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            Today
          </button>
        </li>
        <li>
          <button 
            className={`navbar-link ${currentPage === 'history' ? 'active' : ''}`}
            onClick={() => handleNav('history')}
          >
            History
          </button>
        </li>
        <li>
          <button 
            className={`navbar-link ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => handleNav('profile')}
          >
            Profile
          </button>
        </li>
        <li>
          <button className="navbar-logout" onClick={signOut}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
