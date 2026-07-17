import React from 'react';

const TicketModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">Ticket details</p>
            <h3>{ticket.title}</h3>
          </div>
          <button className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal-grid">
          <div>
            <p className="modal-label">Description</p>
            <p className="modal-text">{ticket.description}</p>
          </div>
          <div className="modal-meta-row">
            <div>
              <p className="modal-label">Status</p>
              <span className={`status-badge status-${ticket.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                {ticket.status}
              </span>
            </div>
            <div>
              <p className="modal-label">Priority</p>
              <span className={`priority-badge priority-${ticket.priority?.toLowerCase()}`}>
                {ticket.priority}
              </span>
            </div>
          </div>
          <div>
            <p className="modal-label">Employee</p>
            <p className="modal-text">{ticket.createdBy?.name || 'Unknown employee'}</p>
          </div>
          <div>
            <p className="modal-label">Department</p>
            <p className="modal-text">{ticket.department || 'Operations'}</p>
          </div>
          <div>
            <p className="modal-label">Technician</p>
            <p className="modal-text">{ticket.assignedTo || 'Unassigned'}</p>
          </div>
          <div>
            <p className="modal-label">Submitted</p>
            <p className="modal-text">{new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TicketModal;
