import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, FloatButton, Form } from 'antd';
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { callApi } from '../utils/api.util';
import { appApi } from '../apis/_index';
import notify from '../utils/notify';
import { AppsGrid, CreateAppModal, EmptyAppsState, AdminContainer } from '../components/admin/_index';
import { useAdmin } from '../hooks/_index';

const AdminDashboard = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { removeAdminToken } = useAdmin();

  const fetchApps = async () => {
    setLoading(true);
    await callApi(
      appApi.getAll(),
      (result) => {
        setApps(result.data || []);
      },
      (error) => {
        console.error('Failed to fetch apps:', error);
      }
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCreateApp = async (values) => {
    setCreating(true);
    await callApi(
      appApi.create(values),
      () => {
        notify.success('App created successfully!');
        setIsModalOpen(false);
        form.resetFields();
        fetchApps();
      },
      (error) => {
        notify.error(error.message || 'Failed to create app');
      }
    );
    setCreating(false);
  };

  const handleCardClick = (appId) => {
    navigate(`/admin/apps/${appId}`);
  };

  const handleLogout = () => {
    removeAdminToken();
    navigate('/admin/login');
  };

  return (
    <AdminContainer
      title={`Apps Dashboard (${apps.length} app${apps.length > 1 ? 's' : ''})`}
      className="mtm-admin-dashboard-page"
      maxWidth="1200px"
      primaryAction={{
        content: 'Logout',
        onAction: handleLogout,
        icon: <LogoutOutlined />,
        danger: true,
        type: 'default',
        size: 'large',
        style: { fontWeight: 500 },
      }}
    >
      <Spin spinning={loading}>
        {apps.length === 0 && !loading ? (
          <EmptyAppsState onCreateClick={() => setIsModalOpen(true)} />
        ) : (
          <AppsGrid apps={apps} onCardClick={handleCardClick} />
        )}
      </Spin>

      {/* Floating Action Button */}
      {apps.length > 0 && (
        <FloatButton
          icon={<PlusOutlined />}
          tooltip="Create New App"
          type="primary"
          onClick={() => setIsModalOpen(true)}
        />
      )}

      {/* Create App Modal */}
      <CreateAppModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onCreate={handleCreateApp}
        loading={creating}
        form={form}
      />
    </AdminContainer>
  );
};

export default AdminDashboard;

