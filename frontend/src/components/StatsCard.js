import React from 'react';

const StatsCard = ({ label, value, subtitle, tone, icon }) => {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-card-icon">{icon}</div>
      <div>
        <p className="stat-card-label">{label}</p>
        <h3 className="stat-card-value">{value}</h3>
        <p className="stat-card-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatsCard;
