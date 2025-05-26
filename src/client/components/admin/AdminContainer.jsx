import { Button, Flex, Typography } from 'antd';
import Container from '../Container';
import { useAdmin } from '../../hooks/_index';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Login from '../../pages/Login';

const AdminContainer = ({ title, children, primaryAction, secondaryActions = [], backAction = null, ...props }) => {
  const navigate = useNavigate();
  const { getAdminToken } = useAdmin();

  const isLoggedIn = !!getAdminToken();
  if (!isLoggedIn) return <Login />;

  // Helper to render action (object or ReactNode)
  const renderAction = (action, key) => {
    if (!action) return null;
    if (typeof action === 'object' && !('$$typeof' in action)) {
      // It's an action object
      const { content, onAction, icon, ...rest } = action;
      return (
        <Button key={key} icon={icon} onClick={onAction} {...rest}>
          {content}
        </Button>
      );
    }
    // It's a ReactNode
    return action;
  };

  return (
    <Container {...props}>
      <Flex vertical gap="large">
        <Flex gap="middle" justify="space-between" align="center">
          <Flex align="center" gap="small">
            {backAction && (
              <Button
                icon={<ArrowLeftOutlined />}
                type="text"
                onClick={() => (typeof backAction === 'string' ? navigate(backAction) : backAction())}
                style={{ marginRight: 8 }}
              />
            )}
            <Typography.Title level={3} style={{ margin: 0 }}>
              {title}
            </Typography.Title>
          </Flex>

          <Flex gap="small" align="center">
            {Array.isArray(secondaryActions) &&
              secondaryActions.map((action, idx) => renderAction(action, `secondary-${idx}`))}
            {primaryAction && renderAction(primaryAction, 'primary')}
          </Flex>
        </Flex>

        {children}
      </Flex>
    </Container>
  );
};

export default AdminContainer;

