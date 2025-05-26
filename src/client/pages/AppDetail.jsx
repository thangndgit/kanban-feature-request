import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Descriptions,
  Tag,
  Space,
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
} from 'antd';
import {
  CopyOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { AdminContainer } from '../components/admin/_index';
import { callApi } from '../utils/api.util';
import { appApi } from '../apis/_index';
import notify from '../utils/notify';
import { useAdmin } from '../hooks/_index';

const { Title, Text, Paragraph } = Typography;

const AppDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
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

  // Kanban board button next to title
  const featureTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
      <span>Feature Requests Management</span>
      <Button type="primary">Open Kanban Board</Button>
    </div>
  );

  // App data card actions (gear for edit, trash for delete)
  const appDataCardExtra = (
    <Space>
      <Tooltip title="Edit App">
        <Button
          icon={<EditOutlined />}
          type="text"
          onClick={() => {
            setEditModalOpen(true);
            editForm.setFieldsValue({
              name: app.name,
              description: app.description,
              imageUrl: app.imageUrl,
            });
          }}
        />
      </Tooltip>
      <Tooltip title="Delete App">
        <Button icon={<DeleteOutlined />} type="text" danger onClick={() => setDeleteModalOpen(true)} />
      </Tooltip>
    </Space>
  );

  return (
    <AdminContainer title="App Details" maxWidth="1200px" backAction="/admin/dashboard">
      <Row gutter={[24, 24]} align="stretch">
        {/* Image Column */}
        <Col xs={24} lg={10} style={{ display: 'flex', alignItems: 'stretch' }}>
          <Card
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            {app.imageUrl && (
              <img
                src={app.imageUrl}
                alt={app.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 8,
                  display: 'block',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </Card>
        </Col>

        {/* App Data Column */}
        <Col xs={24} lg={14} style={{ display: 'flex', alignItems: 'stretch' }}>
          <Card title={app.name} extra={appDataCardExtra} style={{ width: '100%', height: '100%' }}>
            <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Description">
                <Text type="secondary">{app.description || 'No description provided'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={app.isActive ? 'green' : 'red'}>{app.isActive ? 'Active' : 'Inactive'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">{new Date(app.createdAt).toLocaleDateString()}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column' }}>
              <Text strong>API Key:</Text>
              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 12,
                  borderRadius: 6,
                  marginTop: 8,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  wordBreak: 'break-all',
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <span>{apiKeyVisible ? app.apiKey : '********************************'}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  <Button
                    icon={apiKeyVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    size="small"
                    type="text"
                    onClick={() => setApiKeyVisible((v) => !v)}
                  />
                  <Button size="small" icon={<CopyOutlined />} onClick={handleCopyApiKey} />
                  <Button size="small" icon={<ReloadOutlined />} onClick={handleRegenerateApiKey} danger />
                </div>
              </div>
            </div>
            <Divider />
            <div>
              <Text strong>Widget Integration:</Text>
              <Paragraph
                copyable={{
                  text: `<script src="https://your-domain.com/widget.js" data-api-key="${app.apiKey}"></script>`,
                }}
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 12,
                  borderRadius: 6,
                  marginTop: 8,
                  fontFamily: 'monospace',
                  fontSize: 11,
                }}
              >
                {`<script src="https://your-domain.com/widget.js" data-api-key="${app.apiKey}"></script>`}
              </Paragraph>
            </div>
          </Card>
        </Col>

        {/* Feature Requests Management */}
        <Col xs={24}>
          <Card title={featureTitle}>
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
        </Col>
      </Row>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        title="Delete App"
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDeleteApp}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        Are you sure you want to delete this app? This action cannot be undone.
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        title="Edit App"
        onCancel={() => setEditModalOpen(false)}
        onOk={() => editForm.submit()}
        okText="Save"
        confirmLoading={editLoading}
        cancelText="Cancel"
      >
        <Form
          form={editForm}
          layout="vertical"
          initialValues={{
            name: app.name,
            description: app.description,
            imageUrl: app.imageUrl,
          }}
          onFinish={handleEditApp}
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
          <Form.Item
            name="imageUrl"
            label="App Image URL"
            rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
          >
            <Input placeholder="https://example.com/app-logo.png (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminContainer>
  );
};

export default AppDetail;

