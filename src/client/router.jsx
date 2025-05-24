import { Routes, Route } from 'react-router-dom';

import { AdminContent, AdminDashboard, Home, NotFound } from './pages';

const Router = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/page-editor-live" element={<AdminContent isDev={false} />} />
      <Route path="/admin/page-editor-dev" element={<AdminContent isDev={true} />} />
      <Route path="/preview-dev" element={<Home isDev={true} />} />
      <Route path="/" element={<Home isDev={false} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
