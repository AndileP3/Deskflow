import React, { useCallback, useEffect, useState } from 'react';
import TicketForm from './TicketForm';
import TicketList from './TicketList';
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
      <section className="dashboard-column">
        <TicketForm onSubmit={handleCreate} submitting={submitting} />
        {formError && <p className="error-banner">{formError}</p>}
      </section>

      <section className="dashboard-column">
        <h2>My Tickets</h2>
        <TicketList
          tickets={tickets}
          loading={loading}
          error={error}
          isAdmin={false}
        />
      </section>
    </div>
  );
};

export default EmployeeDashboard;
