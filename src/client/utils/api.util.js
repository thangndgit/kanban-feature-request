import constants from '../constants/constants';
import notify from './notify';

export const callApi = async (
  apiFetch,
  onSuccess = (_data) => {},
  onError = (error) => {
    notify.error(error?.message || 'Something went wrong. Please try again.');
    console.error(error);
  }
) => {
  try {
    const response = await apiFetch();
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    onSuccess(data);
    return data;
    //
  } catch (error) {
    onError(error);
  }
};

export const makeApiFetch = (url, { method = 'get', params, body, headers = {}, isAdmin = false }) => {
  const version = constants.API.VERSION;
  let apiEndpoint = `/api/${version}/${url}`.replace(/\/+/g, '/');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(isAdmin ? { 'x-admin-token': localStorage.getItem('admin_token') } : {}),
    },
  };

  if (params) {
    apiEndpoint += `?${new URLSearchParams(params).toString()}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  return () => fetch(apiEndpoint, options);
};

