import { Layout } from 'antd';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PageLayout.scss';

const { Content } = Layout;

const PageLayout = ({ children }) => {
  return (
    <Layout className="mtm-layout" style={{ background: 'transparent' }}>
      <PageHeader />
      <Content style={{ minHeight: 'calc(100dvh - 64px)' }}>{children}</Content>
      <PageFooter />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Layout>
  );
};

export default PageLayout;
