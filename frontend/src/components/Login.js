import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DEMO_CREDENTIALS = {
  Employee: { email: 'employee@deskflow.com', password: 'password123' },
  Admin: { email: 'admin@deskflow.com', password: 'password123' }
};

const Login = () => {
  const { login, authError, loading } = useAuth();
  const [role, setRole] = useState('Employee');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.Employee.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.Employee.password);

  const handleRoleToggle = (nextRole) => {
    setRole(nextRole);
    setEmail(DEMO_CREDENTIALS[nextRole].email);
    setPassword(DEMO_CREDENTIALS[nextRole].password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {
      // authError is already surfaced via context
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>DeskFlow</h1>
        <p className="subtitle">Internal IT Service Request Portal</p>

        <div className="role-toggle">
          <button
            type="button"
            className={role === 'Employee' ? 'active' : ''}
            onClick={() => handleRoleToggle('Employee')}
          >
            Employee
          </button>
          <button
            type="button"
            className={role === 'Admin' ? 'active' : ''}
            onClick={() => handleRoleToggle('Admin')}
          >
            Admin
          </button>
        </div>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {authError && <div className="error-banner">{authError}</div>}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Signing in...' : `Log in as ${role}`}
        </button>

        <p className="hint">
          Demo credentials are pre-filled. Toggle role above, then log in.
        </p>
      </form>
    </div>
  );
};

export default Login;
