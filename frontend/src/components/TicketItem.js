import React from 'react';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved'];

const priorityClass = (priority) => `priority-badge priority-${priority.toLowerCase()}`;
const statusClass = (status) =>
  `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`;

const TicketItem = ({ ticket, isAdmin, onStatusChange, updating }) => {
  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <h3>{ticket.title}</h3>
        <span className={priorityClass(ticket.priority)}>{ticket.priority}</span>
      </div>

      <p className="ticket-description">{ticket.description}</p>

      <div className="ticket-meta">
        {isAdmin && ticket.createdBy && (
          <span className="ticket-owner">
            Submitted by: {ticket.createdBy.name || 'Unknown'}
          </span>
        )}
        <span className="ticket-date">
          {new Date(ticket.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="ticket-footer">
        {isAdmin ? (
          <select
            className="status-select"
            value={ticket.status}
            disabled={updating}
            onChange={(e) => onStatusChange(ticket._id, e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ) : (
          <span className={statusClass(ticket.status)}>{ticket.status}</span>
        )}
      </div>
    </div>
  );
};

export default TicketItem;
