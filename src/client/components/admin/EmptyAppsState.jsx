import { Empty, Button, Typography, Card } from 'antd';
import { PlusOutlined, AppstoreAddOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EmptyAppsState = ({ onCreateClick }) => (
  <Card>
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <Empty
        image={<AppstoreAddOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
        description={
          <div>
            <Title level={4} style={{ color: '#8c8c8c', marginTop: 16 }}>
              No Apps Found
            </Title>
            <Text type="secondary">Create your first app to get started with feature requests</Text>
          </div>
        }
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick} size="large">
          Create App
        </Button>
      </Empty>
    </div>
  </Card>
);

export default EmptyAppsState;

