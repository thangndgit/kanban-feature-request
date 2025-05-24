import { makeApiFetch } from '../utils/api';

const pageConfigApi = {
  get: (isDev = false) => makeApiFetch('page-config', { params: { isDev } }),
  upsert: (body) =>
    makeApiFetch('page-config', {
      method: 'put',
      body,
      headers: {
        'auth-token': typeof window === 'undefined' ? '' : window.localStorage.getItem('admin_token'),
      },
    }),
};

export default pageConfigApi;
