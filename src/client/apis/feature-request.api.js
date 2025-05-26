import { makeApiFetch } from '../utils/api.util';

const featureRequestApi = {
  createFromWidget: (data) => makeApiFetch('/feature-request', { method: 'post', body: data }),
  getByApp: (appId) => makeApiFetch(`/feature-request/app/${appId}`, { method: 'get' }),
  getPopular: () => makeApiFetch('/feature-request/popular', { method: 'get' }),
  upvote: (id) => makeApiFetch(`/feature-request/${id}/upvote`, { method: 'post' }),
  addComment: (id, data) => makeApiFetch(`/feature-request/${id}/comments`, { method: 'post', body: data }),

  createByAdmin: (data) => makeApiFetch('/feature-request/admin-create', { method: 'post', body: data }),
  getGroupedByStatus: (appId) => makeApiFetch(`/feature-request/grouped/${appId}`, { method: 'get' }),
  search: (query) => makeApiFetch('/feature-request/search', { method: 'get', params: { query } }),
  getById: (id) => makeApiFetch(`/feature-request/${id}`, { method: 'get' }),
  updateById: (id, data) => makeApiFetch(`/feature-request/${id}`, { method: 'put', body: data }),
  deleteById: (id) => makeApiFetch(`/feature-request/${id}`, { method: 'delete' }),
  updateStatus: (id, data) => makeApiFetch(`/feature-request/${id}/status`, { method: 'PATCH', body: data }),
  assignTask: (id, data) => makeApiFetch(`/feature-request/${id}/assign`, { method: 'PATCH', body: data }),
  setReleaseDate: (id, data) => makeApiFetch(`/feature-request/${id}/release-date`, { method: 'PATCH', body: data }),
  bulkUpdateStatus: (data) => makeApiFetch('/feature-request/bulk-update', { method: 'PATCH', body: data }),
  addAdminComment: (id, data) => makeApiFetch(`/feature-request/${id}/admin-comments`, { method: 'post', body: data }),
};

export default featureRequestApi;

