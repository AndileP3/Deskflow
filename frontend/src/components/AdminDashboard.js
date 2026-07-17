import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TicketList from './TicketList';
import StatsCard from './StatsCard';
import { getTickets, updateTicketStatus } from '../api/api';

const STATUS_FILTERS = ['All', 'Open', 'In Progress', 'Resolved'];
const PRIORITY_FILTERS = ['All', 'Low', 'Medium', 'High'];
const SORT_OPTIONS = ['Newest', 'Oldest', 'Priority'];

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
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
      setTickets((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTickets = useMemo(() => {
    const next = tickets.filter((ticket) => {
      const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
      return matchesPriority;
    });

    return [...next].sort((a, b) => {
      if (sortBy === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'Priority') {
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tickets, priorityFilter, sortBy]);

  const counts = useMemo(() => {
    const open = tickets.filter((ticket) => ticket.status === 'Open').length;
    const inProgress = tickets.filter((ticket) => ticket.status === 'In Progress').length;
    const resolved = tickets.filter((ticket) => ticket.status === 'Resolved').length;
    const highPriority = tickets.filter((ticket) => ticket.priority === 'High').length;

    return { open, inProgress, resolved, highPriority };
  }, [tickets]);

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-hero">
        <div>
          <p className="hero-kicker">Operations hub</p>
          <h2>Monitor help desk performance and ticket health</h2>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Open Tickets" value={counts.open} subtitle="Waiting for triage" tone="accent" icon="▣" />
        <StatsCard label="In Progress" value={counts.inProgress} subtitle="Assigned to support" tone="accent-alt" icon="⟳" />
        <StatsCard label="Resolved" value={counts.resolved} subtitle="Completed this week" tone="accent" icon="✓" />
        <StatsCard label="High Priority" value={counts.highPriority} subtitle="Urgent issues" tone="accent-alt" icon="⚡" />
      </div>

      <div className="admin-panel-grid">
        <section className="dashboard-column panel-card admin-main-panel">
          <div className="panel-header">
            <div>
              <p className="helper-text">Company overview</p>
              <h3>All Company Tickets</h3>
            </div>
            <div className="panel-chip">{tickets.length} active</div>
          </div>

          <div className="filter-bar">
            <div className="search-input-shell">
              <span>⌕</span>
              <input type="text" placeholder="Search tickets" className="search-input" />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="filter-select">
              {PRIORITY_FILTERS.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <TicketList
            tickets={filteredTickets}
            loading={loading}
            error={error}
            isAdmin
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
        </section>

        <aside className="admin-side-panel">
          <div className="dashboard-column panel-card">
            <div className="panel-header">
              <div>
                <p className="helper-text">Insights</p>
                <h3>Status distribution</h3>
              </div>
            </div>
            <div className="chart-list">
              <div className="chart-row"><span>Open</span><strong>{counts.open}</strong></div>
              <div className="chart-row"><span>In Progress</span><strong>{counts.inProgress}</strong></div>
              <div className="chart-row"><span>Resolved</span><strong>{counts.resolved}</strong></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
