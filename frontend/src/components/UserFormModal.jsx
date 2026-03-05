import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Switch } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const GENDER_OPTIONS = [
  { value: 'Male',             label: '♂ Male' },
  { value: 'Female',           label: '♀ Female' },
  { value: 'Other',            label: '⚬ Other' },
  { value: 'Prefer not to say',label: '— Prefer not to say' },
];

const ROLE_OPTIONS = [
  { value: 'user',      label: 'User' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'admin',     label: 'Admin' },
];

const UserFormModal = ({ open, onClose, onSubmit, editingUser, loading }) => {
  const [form] = Form.useForm();
  const isEditing = !!editingUser;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          name:   editingUser.name,
          email:  editingUser.email,
          gender: editingUser.gender,
          phone:  editingUser.phone || '',
          role:   editingUser.role || 'user',
          active: editingUser.active !== undefined ? editingUser.active : true,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ role: 'user', gender: 'Prefer not to say', active: true });
      }
    }
  }, [open, editingUser, isEditing, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const result = await onSubmit(values);
      if (result?.success) form.resetFields();
    } catch { /* validation error */ }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: isEditing
              ? 'linear-gradient(135deg, #63b3ed22, #38b2ac22)'
              : 'linear-gradient(135deg, #68d39122, #38b2ac22)',
            border: `1.5px solid ${isEditing ? '#63b3ed44' : '#68d39144'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isEditing ? 'var(--accent-cyan)' : 'var(--accent-green)',
            fontSize: 16,
          }}>
            {isEditing ? <EditOutlined /> : <PlusOutlined />}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 16,
              color: 'var(--text-primary)',
              letterSpacing: '-0.2px',
            }}>
              {isEditing ? 'Edit User' : 'Add New User'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 400 }}>
              {isEditing
                ? `Updating details for ${editingUser?.name}`
                : 'Fill in the details below to create a new user'}
            </div>
          </div>
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isEditing ? 'Save Changes' : 'Create User'}
      cancelText="Cancel"
      confirmLoading={loading}
      width={540}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark="optional" size="large">
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: 'Name is required.' },
            { min: 2, message: 'At least 2 characters.' },
            { max: 100, message: 'Max 100 characters.' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="e.g. Jane Smith" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Email is required.' },
            { type: 'email', message: 'Enter a valid email.' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="e.g. jane@company.com" disabled={isEditing} />
        </Form.Item>

        <Row gutter={14}>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select a gender.' }]}
            >
              <Select placeholder="Select gender">
                {GENDER_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="role" label="Role">
              <Select placeholder="Select role">
                {ROLE_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ pattern: /^[+\d\s\-()]{7,20}$/, message: 'Enter a valid phone number.' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="e.g. +1-555-0100" />
        </Form.Item>

        {/* ── Active / Inactive Toggle ── */}
        <Form.Item label="Account Status">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Form.Item name="active" valuePropName="checked" noStyle>
                <Switch
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<StopOutlined />}
                  style={{ minWidth: 52 }}
                />
              </Form.Item>
              <Form.Item name="active" noStyle>
                {({ getFieldValue }) => (
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: form.getFieldValue('active')
                      ? 'var(--accent-green)'
                      : 'var(--text-muted)',
                  }}>
                    {form.getFieldValue('active') ? 'Active' : 'Inactive'}
                  </span>
                )}
              </Form.Item>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {isEditing ? 'Toggle to change user status' : 'New users are active by default'}
            </span>
          </div>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default UserFormModal;
