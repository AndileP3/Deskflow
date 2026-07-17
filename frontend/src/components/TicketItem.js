import React, { useMemo, useState } from 'react';
import TicketModal from './TicketModal';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved'];

const priorityClass = (priority) => `priority-badge priority-${priority.toLowerCase()}`;
const statusClass = (status) =>
  `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`;

const TicketItem = ({ ticket, isAdmin, onStatusChange, updating }) => {
  const [isOpen, setIsOpen] = useState(false);

  const createdDate = useMemo(() => new Date(ticket.createdAt).toLocaleDateString(), [ticket.createdAt]);

  return (
    <>
      <div className="ticket-card" onClick={() => setIsOpen(true)}>
        <div className="ticket-card-header">
          <div>
            <div className="ticket-card-title-row">
              <h3>{ticket.title}</h3>
              <span className={priorityClass(ticket.priority)}>{ticket.priority}</span>
            </div>
            <p className="ticket-description">{ticket.description}</p>
          </div>
        </div>

        <div className="ticket-meta-grid">
          <div className="ticket-meta-block">
            <span className="ticket-meta-label">Employee</span>
            <span>{ticket.createdBy?.name || 'Unknown'}</span>
          </div>
          <div className="ticket-meta-block">
            <span className="ticket-meta-label">Dept</span>
            <span>{ticket.department || 'Operations'}</span>
          </div>
          <div className="ticket-meta-block">
            <span className="ticket-meta-label">Ticket ID</span>
            <span>#{String(ticket._id || '1001').slice(-4)}</span>
          </div>
          <div className="ticket-meta-block">
            <span className="ticket-meta-label">Date</span>
            <span>{createdDate}</span>
          </div>
        </div>

        <div className="ticket-footer-row">
          <div className="ticket-pill-group">
            <span className="ticket-pill">Assigned: {ticket.assignedTo || 'Unassigned'}</span>
            <span className="ticket-pill">Comments: 2</span>
            <span className="ticket-pill">Attachments: 1</span>
          </div>
          <div className="ticket-footer-actions">
            {isAdmin ? (
              <select
                className="status-select"
                value={ticket.status}
                disabled={updating}
                onChange={(e) => onStatusChange(ticket._id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
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
      </div>

      <TicketModal ticket={isOpen ? ticket : null} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default TicketItem;
