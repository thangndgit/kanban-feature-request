import { makeApiFetch } from '../utils/api';

const adminApi = {
  login: (body) => makeApiFetch('admin/login', { method: 'post', body }),
};

export default adminApi;
