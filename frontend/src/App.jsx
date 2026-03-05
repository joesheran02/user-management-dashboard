import React, { useState } from 'react';
import { ConfigProvider, Select, Tooltip, Alert } from 'antd';
import {
  UserAddOutlined,
  ReloadOutlined,
  DashboardOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useUsers } from './hooks/useUsers';
import UsersTable from './components/UsersTable';
import UserFormModal from './components/UserFormModal';
import StatsCards from './components/StatsCards';
import './App.css';

const { Option } = Select;

const GENDER_FILTERS = [
  { value: 'All',    label: 'All Genders' },
  { value: 'Male',   label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other',  label: 'Other' },
];

function App() {
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { users, allUsers, loading, mutating, error, genderFilter, actions } = useUsers();

  const handleOpenAdd  = () => { setEditingUser(null); setModalOpen(true); };
  const handleOpenEdit = (u) => { setEditingUser(u);   setModalOpen(true); };
  const handleClose    = () => { setModalOpen(false);  setEditingUser(null); };

  const handleSubmit = async (values) => {
    const result = editingUser
      ? await actions.editUser(editingUser.id, values)
      : await actions.addUser(values);
    if (result.success) handleClose();
    return result;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#63b3ed',
          borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif",
          colorBgContainer: '#1a2236',
          colorBorder: 'rgba(255,255,255,0.06)',
          colorText: '#e8edf5',
          colorTextSecondary: '#8a96aa',
          colorTextPlaceholder: '#4a5568',
          colorBgElevated: '#1a2236',
          colorFillAlter: 'rgba(255,255,255,0.02)',
          colorSplit: 'rgba(255,255,255,0.06)',
        },
      }}
    >
      <div style={{ minHeight: '100vh' }}>

        {/* ══ TOPBAR ══════════════════════════════════════════════ */}
        <header className="dash-topbar">
          <div className="topbar-brand">
            <div className="brand-icon">
              <DashboardOutlined />
            </div>
            <div>
              <div className="brand-text-title">UserControl</div>
              <div className="brand-text-sub">Management Dashboard</div>
            </div>
          </div>

          <div className="topbar-pill">
            <span className="topbar-pill-dot" />
            <span>Live</span>
            <span className="topbar-pill-count">{allUsers.length}</span>
            <span>users</span>
          </div>
        </header>

        {/* ══ CONTENT ═════════════════════════════════════════════ */}
        <main className="dash-content">

          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">
              User <span>Management</span>
            </h1>
            <p className="page-subtitle">
              Manage your team — add, edit, filter and remove users from one place.
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert
              className="dash-alert"
              message="Connection Error"
              description={`Could not reach the API: ${error}. Make sure the backend is running.`}
              type="error"
              showIcon
              closable
            />
          )}

          {/* Stats */}
          <StatsCards users={allUsers} loading={loading} />

          {/* Table Card */}
          <div className="table-card">

            {/* Toolbar */}
            <div className="table-toolbar">
              <div className="toolbar-left">
                <h5>All Users</h5>
                <p>
                  Showing {users.length}{genderFilter !== 'All' ? ` ${genderFilter}` : ''} user{users.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="toolbar-right">
                {/* Gender Filter */}
                <div className="filter-select-wrap">
                  <FilterOutlined style={{ color: 'var(--text-muted)', fontSize: 13 }} />
                  <span className="filter-label">Filter</span>
                  <Select
                    value={genderFilter}
                    onChange={actions.setGenderFilter}
                    style={{ width: 150 }}
                    size="middle"
                  >
                    {GENDER_FILTERS.map((f) => (
                      <Option key={f.value} value={f.value}>{f.label}</Option>
                    ))}
                  </Select>
                </div>

                {/* Refresh */}
                <Tooltip title="Refresh users">
                  <button
                    className="btn-dark-outline"
                    onClick={actions.loadUsers}
                    disabled={loading}
                  >
                    <ReloadOutlined style={{ ...(loading && { animation: 'spin 1s linear infinite' }) }} />
                    Refresh
                  </button>
                </Tooltip>

                {/* Add User */}
                <button
                  className="btn-primary-glow"
                  onClick={handleOpenAdd}
                  disabled={loading}
                >
                  <UserAddOutlined />
                  Add User
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ padding: '16px 24px 24px' }}>
              <UsersTable
                users={users}
                loading={loading}
                mutating={mutating}
                onEdit={handleOpenEdit}
                onDelete={actions.deleteUser}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <UserFormModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editingUser={editingUser}
        loading={mutating}
      />
    </ConfigProvider>
  );
}

export default App;
