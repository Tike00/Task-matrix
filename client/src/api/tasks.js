import request from './request';

export function getProjectTasksApi(projectId) {
  return request.get(`/project-tasks/project/${projectId}`);
}

export function createProjectTaskApi(projectId, data) {
  return request.post(`/project-tasks/project/${projectId}`, data);
}

export function reorderProjectTasksApi(projectId, items) {
  return request.put(`/project-tasks/project/${projectId}/reorder`, { items });
}

export function moveProjectTaskApi(id, data) {
  return request.post(`/project-tasks/${id}/move`, data);
}

export function updateProjectTaskApi(id, data) {
  return request.put(`/project-tasks/${id}`, data);
}

export function deleteProjectTaskApi(id) {
  return request.delete(`/project-tasks/${id}`);
}

export function executeTaskApi(id) {
  return request.post(`/project-tasks/${id}/execute`);
}

export function stopTaskApi(id) {
  return request.post(`/project-tasks/${id}/stop`);
}

export function getTaskResultsApi(id) {
  return request.get(`/project-tasks/${id}/results`);
}

export function getTaskLatestResultApi(id) {
  return request.get(`/project-tasks/${id}/latest-result`);
}