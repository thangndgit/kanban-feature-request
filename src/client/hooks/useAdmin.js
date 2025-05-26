import { useCallback } from 'react';

const useAdmin = () => {
  const getAdminToken = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('admin_token');
  }, []);

  const setAdminToken = useCallback((token) => {
    if (typeof window === 'undefined') return false;
    return localStorage.setItem('admin_token', token);
  }, []);

  const removeAdminToken = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.removeItem('admin_token');
  }, []);

  return { getAdminToken, setAdminToken, removeAdminToken };
};

export default useAdmin;

