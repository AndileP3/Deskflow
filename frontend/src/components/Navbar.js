import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">DeskFlow</div>
      {user && (
        <div className="navbar-user">
          <span className="user-badge">{user.role}</span>
          <span className="user-name">{user.name}</span>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
