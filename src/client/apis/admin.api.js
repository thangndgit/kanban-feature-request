import { makeApiFetch } from '../utils/api.util';

const adminApi = {
  login: (body) => makeApiFetch('/admin/login', { method: 'post', body }),
};

export default adminApi;

