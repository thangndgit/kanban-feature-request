import { Button, Result } from 'antd';
import { Container } from '../components/_index';
import { useEffect } from 'react';
import './NotFound.scss';

const NotFound = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <Container className="mtm-not-found-page">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" href="/">
            Back to home
          </Button>
        }
      />
    </Container>
  );
};

export default NotFound;

