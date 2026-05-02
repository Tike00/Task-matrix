import request from './request';

export function getProjectsApi() {
  return request.get('/projects');
}

export function createProjectApi(data) {
  return request.post('/projects', data);
}

export function getProjectDetailApi(id) {
  return request.get(`/projects/${id}`);
}

export function updateProjectApi(id, data) {
  return request.put(`/projects/${id}`, data);
}

export function deleteProjectApi(id) {
  return request.delete(`/projects/${id}`);
}