import { Modal, Form, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const CreateAppModal = ({ open, onCancel, onCreate, loading, form }) => (
  <Modal
    title="Create New App"
    open={open}
    onCancel={() => {
      onCancel();
      form.resetFields();
    }}
    footer={null}
    width={500}
    centered
  >
    <Form form={form} layout="vertical" onFinish={onCreate} style={{ paddingTop: 16 }}>
      <Form.Item
        name="name"
        label="App Name"
        rules={[
          { required: true, message: 'Please enter app name' },
          { max: 100, message: 'App name must be less than 100 characters' },
        ]}
      >
        <Input placeholder="Enter app name (e.g., My E-commerce Site)" size="large" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ max: 500, message: 'Description must be less than 500 characters' }]}
      >
        <Input.TextArea placeholder="Brief description of your app (optional)" rows={3} size="large" />
      </Form.Item>

      <Form.Item name="imageUrl" label="App Image URL" rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
        <Input placeholder="https://example.com/app-logo.png (optional)" size="large" />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Button
          onClick={() => {
            onCancel();
            form.resetFields();
          }}
          style={{ marginRight: 8 }}
        >
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />}>
          Create App
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

export default CreateAppModal;

