import request from './request';

export function getPhasesByProjectApi(projectId) {
  return request.get(`/phases/project/${projectId}`);
}

export function createPhaseApi(projectId, data) {
  return request.post(`/phases/project/${projectId}`, data);
}

export function reorderPhasesApi(projectId, items) {
  return request.put(`/phases/project/${projectId}/reorder`, { items });
}

export function getPhaseDetailApi(id) {
  return request.get(`/phases/${id}`);
}

export function updatePhaseApi(id, data) {
  return request.put(`/phases/${id}`, data);
}

export function deletePhaseApi(id) {
  return request.delete(`/phases/${id}`);
}

export function executePhaseApi(id) {
  return request.post(`/phases/${id}/execute`);
}

export function getPhaseSummaryApi(id) {
  return request.get(`/phases/${id}/summary`);
}