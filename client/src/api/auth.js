import request from './request';

export function loginApi(data) {
  return request.post('/auth/login', data);
}

export function meApi() {
  return request.get('/auth/me');
}

export function changePasswordApi(data) {
  return request.post('/auth/change-password', data);
}