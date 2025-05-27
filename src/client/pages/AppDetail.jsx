import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Descriptions,
  Tag,
  Spin,
  Typography,
  Divider,
  Row,
  Col,
  Alert,
  Modal,
  Tooltip,
  Form,
  Input,
  Image,
  Flex,
  Space,
} from 'antd';
import { CopyOutlined, ReloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { AdminContainer } from '../components/admin/_index';
import { callApi } from '../utils/api.util';
import { appApi } from '../apis/_index';
import notify from '../utils/notify';
import { useAdmin } from '../hooks/_index';
import { formatDateTime } from '../utils/_index';

const { Title, Text, Paragraph } = Typography;

function AppImageCard({ imageUrl, name }) {
  return (
    <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {imageUrl && <Image src={imageUrl} alt={name} onError={(e) => (e.target.style.display = 'none')} />}
    </Card>
  );
}

function AppDataCard({ app, onEdit, onDelete, onCopyApiKey, onRegenerateApiKey, loading }) {
  return (
    <Card
      title={app.name}
      extra={
        <Flex align="center">
          <Tooltip title="Edit App">
            <Button icon={<EditOutlined />} type="text" onClick={onEdit} />
          </Tooltip>
          <Tooltip title="Delete App">
            <Button icon={<DeleteOutlined />} type="text" danger onClick={onDelete} />
          </Tooltip>
        </Flex>
      }
      style={{ width: '100%', height: '100%' }}
      loading={loading}
    >
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Description">
          <Text type="secondary">{app.description || 'No description provided'}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={app.isActive ? 'green' : 'red'}>{app.isActive ? 'Active' : 'Inactive'}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Created">{formatDateTime(app.createdAt)}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Flex vertical gap={8}>
        <Text strong>API Key:</Text>

        <Text style={{ fontSize: 12, fontFamily: 'monospace', background: '#f5f5f5', padding: 8, borderRadius: 6 }}>
          <Flex gap={8} justify="space-between" align="center">
            <span>{app.apiKey}</span>

            <Flex gap={8}>
              <Button size="small" icon={<CopyOutlined />} onClick={onCopyApiKey} />
              <Button size="small" icon={<ReloadOutlined />} onClick={onRegenerateApiKey} danger />
            </Flex>
          </Flex>
        </Text>
      </Flex>
      <Divider />

      <Flex vertical gap={8}>
        <Text strong>Widget Integration:</Text>
        <Paragraph
          copyable={{
            text: `<script src="https://your-domain.com/widget.js" data-api-key="${app.apiKey}"></script>`,
          }}
          style={{ fontSize: 12, fontFamily: 'monospace', background: '#f5f5f5', padding: 8, borderRadius: 6 }}
        >
          {`<script src="https://your-domain.com/widget.js" data-api-key="${app.apiKey}"></script>`}
        </Paragraph>
      </Flex>
    </Card>
  );
}

function FeatureRequestsCard({ appId }) {
  const navigate = useNavigate();
  return (
    <Card
      title={
        <Row align="middle" justify="space-between" style={{ width: '100%' }}>
          <Col>Feature Requests Management</Col>
          <Col>
            <Space>
              <Button type="primary" onClick={() => navigate(`/admin/apps/${appId}/kanban`)}>
                Open Kanban Board
              </Button>
            </Space>
          </Col>
        </Row>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                0
              </Title>
              <Text type="secondary">Pending Requests</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                0
              </Title>
              <Text type="secondary">Completed</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#faad14' }}>
                0
              </Title>
              <Text type="secondary">In Progress</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

function EditAppModal({ open, onCancel, onOk, loading, form, app }) {
  return (
    <Modal
      open={open}
      title="Edit App"
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Save"
      confirmLoading={loading}
      cancelText="Cancel"
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: app?.name,
          description: app?.description,
          imageUrl: app?.imageUrl,
        }}
        onFinish={onOk}
      >
        <Form.Item
          name="name"
          label="App Name"
          rules={[
            { required: true, message: 'Please enter app name' },
            { max: 100, message: 'App name must be less than 100 characters' },
          ]}
        >
          <Input placeholder="Enter app name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ max: 500, message: 'Description must be less than 500 characters' }]}
        >
          <Input.TextArea placeholder="Brief description (optional)" rows={3} />
        </Form.Item>
        <Form.Item name="imageUrl" label="App Image URL" rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
          <Input placeholder="https://example.com/app-logo.png (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function DeleteAppModal({ open, onCancel, onOk }) {
  return (
    <Modal
      open={open}
      title="Delete App"
      onCancel={onCancel}
      onOk={onOk}
      okText="Delete"
      okButtonProps={{ danger: true }}
      cancelText="Cancel"
      centered
    >
      Are you sure you want to delete this app? This action cannot be undone.
    </Modal>
  );
}

const AppDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm] = Form.useForm();
  const { getAdminToken } = useAdmin();

  // Redirect to /admin/login if not logged in
  useEffect(() => {
    if (!getAdminToken()) {
      navigate('/admin/login');
    }
  }, [getAdminToken, navigate]);

  const fetchApp = useCallback(async () => {
    setLoading(true);
    await callApi(
      appApi.getById(id),
      (result) => {
        setApp(result.data);
      },
      (error) => {
        console.error('Failed to fetch app:', error);
        notify.error('Failed to load app details');
      }
    );
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchApp();
  }, [fetchApp]);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(app.apiKey);
    notify.success('API key copied to clipboard!');
  };

  const handleRegenerateApiKey = async () => {
    await callApi(
      appApi.regenerateApiKey(id),
      (result) => {
        setApp(result.data);
        notify.success('API key regenerated successfully!');
      },
      (_error) => {
        notify.error('Failed to regenerate API key');
      }
    );
  };

  const handleDeleteApp = async () => {
    await callApi(
      appApi.deleteById(id),
      () => {
        notify.success('App deleted successfully!');
        setDeleteModalOpen(false);
        navigate('/admin/dashboard');
      },
      (_error) => {
        notify.error('Failed to delete app');
        setDeleteModalOpen(false);
      }
    );
  };

  const handleEditApp = async (values) => {
    setEditLoading(true);
    await callApi(
      appApi.updateById(id, values),
      (result) => {
        setApp(result.data);
        notify.success('App updated successfully!');
        setEditModalOpen(false);
        fetchApp();
      },
      (_error) => {
        notify.error('Failed to update app');
      }
    );
    setEditLoading(false);
  };

  if (loading) {
    return (
      <AdminContainer title="App Details" maxWidth="1200px" backAction="/admin/dashboard">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      </AdminContainer>
    );
  }

  if (!app) {
    return (
      <AdminContainer title="App Not Found" maxWidth="1200px" backAction="/admin/dashboard">
        <Alert
          message="App Not Found"
          description="The app you're looking for doesn't exist or has been deleted."
          type="error"
          showIcon
          action={<Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>}
        />
      </AdminContainer>
    );
  }

  return (
    <AdminContainer title="App Details" maxWidth="1200px" backAction="/admin/dashboard">
      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} lg={10} style={{ display: 'flex', alignItems: 'stretch' }}>
          <AppImageCard imageUrl={app.imageUrl} name={app.name} />
        </Col>
        <Col xs={24} lg={14} style={{ display: 'flex', alignItems: 'stretch' }}>
          <AppDataCard
            app={app}
            onEdit={() => {
              setEditModalOpen(true);
              editForm.setFieldsValue({
                name: app.name,
                description: app.description,
                imageUrl: app.imageUrl,
              });
            }}
            onDelete={() => setDeleteModalOpen(true)}
            onCopyApiKey={handleCopyApiKey}
            onRegenerateApiKey={handleRegenerateApiKey}
            loading={editLoading}
          />
        </Col>
        <Col xs={24}>
          <FeatureRequestsCard appId={id} />
        </Col>
      </Row>
      <DeleteAppModal open={deleteModalOpen} onCancel={() => setDeleteModalOpen(false)} onOk={handleDeleteApp} />
      <EditAppModal
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleEditApp}
        loading={editLoading}
        form={editForm}
        app={app}
      />
    </AdminContainer>
  );
};

export default AppDetail;

