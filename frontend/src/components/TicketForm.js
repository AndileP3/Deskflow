import React, { useState } from 'react';

const initialForm = { title: '', description: '', priority: 'Medium' };

const TicketForm = ({ onSubmit, submitting }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required';
    else if (form.title.length > 120) nextErrors.title = 'Title must be under 120 characters';

    if (!form.description.trim()) nextErrors.description = 'Description is required';
    else if (form.description.length > 2000)
      nextErrors.description = 'Description must be under 2000 characters';

    if (!['Low', 'Medium', 'High'].includes(form.priority))
      nextErrors.priority = 'Select a valid priority';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await onSubmit(form);
    if (success) {
      setForm(initialForm);
      setErrors({});
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <h2>Submit a New Ticket</h2>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        value={form.title}
        onChange={handleChange('title')}
        placeholder="e.g. VPN keeps disconnecting"
      />
      {errors.title && <span className="field-error">{errors.title}</span>}

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        rows={4}
        value={form.description}
        onChange={handleChange('description')}
        placeholder="Describe the issue in detail..."
      />
      {errors.description && <span className="field-error">{errors.description}</span>}

      <label htmlFor="priority">Priority</label>
      <select id="priority" value={form.priority} onChange={handleChange('priority')}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      {errors.priority && <span className="field-error">{errors.priority}</span>}

      <button type="submit" className="primary-btn" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  );
};

export default TicketForm;
