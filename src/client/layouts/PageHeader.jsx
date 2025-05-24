import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';

const PageHeader = () => {
  return (
    <header
      className="mtm-header"
      style={{
        height: '64px',
        background: '#EFEDED',
        boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
        paddingLeft: 'min(50px, 4dvw)',
        paddingRight: 'min(50px, 4dvw)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', height: 64 }}>
        <Link to="https://tapita.io/" target="_blank" style={{ display: 'flex' }}>
          <img src={logo} alt="Tapita logo" style={{ height: 36 }} />
        </Link>
      </div>
    </header>
  );
};

export default PageHeader;
