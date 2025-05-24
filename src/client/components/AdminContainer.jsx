import { Button, Flex, Typography } from 'antd';
import Container from './Container';
import { useMemo } from 'react';
import { useAdmin } from '../hooks';
import { NotFound } from '../pages';
import Login from '../pages/Login';
import { useNavigate } from 'react-router-dom';

const AdminContainer = ({ title, children, primaryAction, secondaryAction, ...props }) => {
  const navigate = useNavigate();
  const { isAdmin, getAdminToken, removeAdminToken } = useAdmin();
  if (!isAdmin) return <NotFound />;

  const isLoggedIn = !!getAdminToken();
  if (!isLoggedIn) return <Login />;

  return (
    <Container {...props}>
      <Flex vertical gap="large">
        <AdminNavigation />

        <Flex gap="middle" justify="space-between" align="center">
          <Typography.Title level={3} style={{ margin: 0 }}>
            {title}
          </Typography.Title>

          <Flex gap="small" align="center">
            {secondaryAction}

            {primaryAction || (
              <Button
                danger
                type="default"
                style={{ fontWeight: 500 }}
                size="large"
                onClick={() => {
                  removeAdminToken();
                  navigate(0);
                }}
              >
                Logout
              </Button>
            )}
          </Flex>
        </Flex>

        {children}
      </Flex>
    </Container>
  );
};

function AdminNavigation() {
  const navList = useMemo(
    () => [
      { url: '/', content: 'Home', target: '_blank' },
      { url: '/admin/dashboard', content: 'Dashboard', target: undefined },
      { url: '/admin/page-editor-dev', content: 'Page editor (DEV)', target: undefined },
      { url: '/admin/page-editor-live', content: 'Page editor (LIVE)', target: undefined },
    ],
    []
  );

  const navMarkup = useMemo(
    () =>
      navList.map(({ url, content, target }) => {
        const isActive = typeof window === 'undefined' ? false : url === window.location.pathname;

        return (
          <Button
            key={url}
            href={url}
            target={target}
            type={isActive ? 'primary' : 'text'}
            style={{ borderRadius: 100 }}
          >
            {content}
          </Button>
        );
      }),
    [navList]
  );

  return (
    <div
      style={{
        top: 20,
        width: 'fit-content',
        zIndex: 1000,
        margin: 'auto',
        padding: '10px 12px',
        position: 'sticky',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
        background: 'white',
        borderRadius: 100,
      }}
    >
      <Flex gap="small" justify="center">
        {navMarkup}
      </Flex>
    </div>
  );
}

export default AdminContainer;
