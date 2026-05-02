import request from './request';

export function getSettingsApi() {
  return request.get('/system-settings');
}

export function updateSettingsApi(data) {
  return request.put('/system-settings', data);
}