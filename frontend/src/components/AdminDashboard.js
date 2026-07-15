import React, { useCallback, useEffect, useState } from 'react';
import TicketList from './TicketList';
import { getTickets, updateTicketStatus } from '../api/api';

const STATUS_FILTERS = ['All', 'Open', 'In Progress', 'Resolved'];

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTickets = useCallback(async (status) => {
    setLoading(true);
    setError('');
    try {
      const res = await getTickets(status === 'All' ? undefined : status);
      setTickets(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets(filter);
  }, [fetchTickets, filter]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateTicketStatus(id, status);
      setTickets((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-header">
        <h2>All Company Tickets</h2>
        <div className="filter-bar">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={filter === s ? 'active' : ''}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <TicketList
        tickets={tickets}
        loading={loading}
        error={error}
        isAdmin
        onStatusChange={handleStatusChange}
        updatingId={updatingId}
      />
    </div>
  );
};

export default AdminDashboard;
