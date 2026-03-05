import React from 'react';
import {
  TeamOutlined,
  ManOutlined,
  WomanOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const CARDS = [
  { key: 'total',  label: 'Total Users',  icon: <TeamOutlined />,         variant: 'cyan',   getValue: (u) => u.length },
  { key: 'male',   label: 'Male Users',   icon: <ManOutlined />,          variant: 'violet', getValue: (u) => u.filter((x) => x.gender === 'Male').length },
  { key: 'female', label: 'Female Users', icon: <WomanOutlined />,        variant: 'rose',   getValue: (u) => u.filter((x) => x.gender === 'Female').length },
  { key: 'active', label: 'Active Users', icon: <CheckCircleOutlined />,  variant: 'green',  getValue: (u) => u.filter((x) => x.active).length },
];

const StatsCards = ({ users, loading }) => (
  <div className="stats-grid">
    {CARDS.map(({ key, label, icon, variant, getValue }, i) => (
      <div
        className={`stat-card stat-card--${variant}`}
        key={key}
        style={{ animationDelay: `${0.1 + i * 0.07}s`, animation: 'fadeUp 0.5s ease both' }}
      >
        <div className={`stat-icon-wrap stat-icon-wrap--${variant}`}>{icon}</div>
        {loading ? (
          <>
            <div className="stat-skeleton" style={{ width: '60%' }} />
            <div className="stat-skeleton" style={{ width: '40%', height: 14, marginTop: 4 }} />
          </>
        ) : (
          <>
            <div className="stat-value">{getValue(users)}</div>
            <div className="stat-label">{label}</div>
          </>
        )}
      </div>
    ))}
  </div>
);

export default StatsCards;
