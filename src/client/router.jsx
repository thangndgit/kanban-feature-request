import { Routes, Route } from 'react-router-dom';

import { AdminDashboard, NotFound, AppDetail } from './pages/_index';

const Router = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/apps/:id" element={<AppDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;

