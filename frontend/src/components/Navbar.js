import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-brand-mark">D</div>
        <span>DeskFlow</span>
      </div>
      {user && (
        <div className="navbar-user">
          <button className="nav-icon-btn" aria-label="Notifications">🔔</button>
          <div className="avatar-chip">
            <span className="avatar-init">{user.name?.charAt(0) || 'U'}</span>
            <span className="user-name">{user.name}</span>
          </div>
          <span className="role-chip">{user.role}</span>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
