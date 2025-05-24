import './App.css';
import { PageLayout } from './layouts';
import Router from './router';

function App() {
  if (typeof window !== 'undefined') {
    window.turnOnAdminMode = (password) => {
      localStorage.setItem('admin_password', password);
      window.location.reload();
    };
    window.turnOffAdminMode = () => {
      localStorage.removeItem('admin_password');
      window.location.reload();
    };
  }

  return (
    <PageLayout>
      <Router />
    </PageLayout>
  );
}

export default App;
