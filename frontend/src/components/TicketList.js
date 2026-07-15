import React from 'react';
import TicketItem from './TicketItem';

const TicketList = ({ tickets, loading, error, isAdmin, onStatusChange, updatingId }) => {
  if (loading) return <p className="info-text">Loading tickets...</p>;
  if (error) return <p className="error-banner">{error}</p>;
  if (!tickets.length) return <p className="info-text">No tickets to show yet.</p>;

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket._id}
          ticket={ticket}
          isAdmin={isAdmin}
          onStatusChange={onStatusChange}
          updating={updatingId === ticket._id}
        />
      ))}
    </div>
  );
};

export default TicketList;
