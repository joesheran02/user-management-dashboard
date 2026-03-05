import React, { useState } from 'react';
import { Table, Popconfirm, Tooltip, Typography } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

const AVATAR_COLORS = ['#63b3ed','#38b2ac','#9f7aea','#fc8181','#f6ad55','#68d391'];

const getInitials = (name) =>
  name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

const getAvatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const GenderTag = ({ gender }) => {
  const map = {
    Male:             { cls: 'tag-male',   icon: <ManOutlined /> },
    Female:           { cls: 'tag-female', icon: <WomanOutlined /> },
    Other:            { cls: 'tag-other',  icon: <UserOutlined /> },
    'Prefer not to say': { cls: 'tag-default', icon: <UserOutlined /> },
  };
  const { cls, icon } = map[gender] || map['Prefer not to say'];
  return <span className={`tag ${cls}`}>{icon} {gender}</span>;
};

const RoleTag = ({ role }) => {
  const cls = { admin: 'tag-admin', moderator: 'tag-moderator', user: 'tag-user' }[role] || 'tag-default';
  return (
    <span className={`tag ${cls}`} style={{ textTransform: 'capitalize' }}>
      {role}
    </span>
  );
};

const StatusTag = ({ active }) => (
  <span className={`tag ${active ? 'tag-active' : 'tag-inactive'}`}>
    {active ? '● Active' : '○ Inactive'}
  </span>
);

const UsersTable = ({ users, loading, mutating, onEdit, onDelete }) => {
  const [searchText, setSearchText] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'User',
      key: 'user',
      width: 240,
      render: (_, r) => (
        <div className="user-cell">
          <div
            className="user-avatar"
            style={{
              background: `${getAvatarColor(r.name)}22`,
              color: getAvatarColor(r.name),
              border: `1.5px solid ${getAvatarColor(r.name)}44`,
            }}
          >
            {getInitials(r.name)}
          </div>
          <div>
            <div className="user-name">{r.name}</div>
            <div className="user-email">{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 130,
      render: (g) => <GenderTag gender={g} />,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (p) => p
        ? <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p}</span>
        : <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 110,
      render: (r) => <RoleTag role={r} />,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (a) => <StatusTag active={a} />,
    },
    {
      title: 'Joined',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      render: (d) => (
        <Tooltip title={dayjs(d).format('MMM D, YYYY HH:mm')}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {dayjs(d).fromNow()}
          </span>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Tooltip title="Edit user">
            <button
              className="action-btn action-btn-edit"
              onClick={() => onEdit(r)}
              disabled={mutating}
            >
              <EditOutlined />
            </button>
          </Tooltip>
          <Popconfirm
            title={<span style={{ fontWeight: 600 }}>Remove this user?</span>}
            description={
              <span style={{ fontSize: 13 }}>
                <strong>{r.name}</strong> will be soft-deleted.
              </span>
            }
            onConfirm={() => onDelete(r.id, r.name)}
            okText="Remove"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Tooltip title="Delete user">
              <button
                className="action-btn action-btn-delete"
                disabled={mutating}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Search */}
      <div className="search-wrap">
        <SearchOutlined className="search-icon" />
        <input
          className="search-input form-control"
          placeholder="Search by name or email…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        loading={loading || mutating}
        scroll={{ x: 900 }}
        className="table-body-wrap"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 25, 50],
          showTotal: (total, range) => (
            <Text style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {range[0]}–{range[1]} of <strong style={{ color: 'var(--text-secondary)' }}>{total}</strong>
            </Text>
          ),
        }}
        rowClassName={(r) => (!r.active ? 'inactive-row' : '')}
        locale={{
          emptyText: (
            <div className="empty-state">
              <div className="empty-state-icon"><UserOutlined /></div>
              <p className="empty-state-text">No users found</p>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default UsersTable;
