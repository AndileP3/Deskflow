import React from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {!user && <Login />}
        {user && user.role === 'Employee' && <EmployeeDashboard />}
        {user && user.role === 'Admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;
