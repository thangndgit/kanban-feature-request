import { makeApiFetch } from '../utils/api.util';

const appApi = {
  validateApiKey: (apiKey) => makeApiFetch('/app/validate-key', { method: 'post', body: { apiKey } }),
  getByApiKey: (apiKey) => makeApiFetch('/app/info', { method: 'get', headers: { 'x-api-key': apiKey } }),

  getAll: () => makeApiFetch('/app', { method: 'get', isAdmin: true }),
  create: (data) => makeApiFetch('/app', { method: 'post', body: data, isAdmin: true }),
  getById: (id) => makeApiFetch(`/app/${id}`, { method: 'get', isAdmin: true }),
  updateById: (id, data) => makeApiFetch(`/app/${id}`, { method: 'put', body: data, isAdmin: true }),
  deleteById: (id) => makeApiFetch(`/app/${id}`, { method: 'delete', isAdmin: true }),
  toggleStatus: (id) => makeApiFetch(`/app/${id}/toggle-status`, { method: 'PATCH', isAdmin: true }),
  regenerateApiKey: (id) => makeApiFetch(`/app/${id}/regenerate-key`, { method: 'PATCH', isAdmin: true }),
};

export default appApi;

