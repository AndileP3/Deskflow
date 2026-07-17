import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TicketForm from './TicketForm';
import TicketList from './TicketList';
import StatsCard from './StatsCard';
import { getTickets, createTicket } from '../api/api';

const EmployeeDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTickets();
      setTickets(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const counts = useMemo(() => {
    const open = tickets.filter((ticket) => ticket.status === 'Open').length;
    const inProgress = tickets.filter((ticket) => ticket.status === 'In Progress').length;
    const resolved = tickets.filter((ticket) => ticket.status === 'Resolved').length;

    return { open, inProgress, resolved };
  }, [tickets]);

  const handleCreate = async (formValues) => {
    setSubmitting(true);
    setFormError('');
    try {
      await createTicket(formValues);
      await fetchTickets();
      return true;
    } catch (err) {
      setFormError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard employee-dashboard">
      <div className="dashboard-hero">
        <div>
          <p className="hero-kicker">Employee workspace</p>
          <h2>Track requests with a modern service desk experience</h2>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Open" value={counts.open} subtitle="Awaiting attention" tone="accent" icon="▣" />
        <StatsCard label="In Progress" value={counts.inProgress} subtitle="Currently being handled" tone="accent-alt" icon="⟳" />
        <StatsCard label="Resolved" value={counts.resolved} subtitle="Completed successfully" tone="accent" icon="✓" />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-column panel-card">
          <TicketForm onSubmit={handleCreate} submitting={submitting} />
          {formError && <p className="error-banner">{formError}</p>}
        </section>

        <section className="dashboard-column panel-card">
          <div className="panel-header">
            <div>
              <p className="helper-text">My queue</p>
              <h3>My Tickets</h3>
            </div>
            <div className="panel-chip">{tickets.length} total</div>
          </div>
          <TicketList tickets={tickets} loading={loading} error={error} isAdmin={false} />
        </section>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
