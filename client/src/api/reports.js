import request from './request';

export function getReportsApi() {
  return request.get('/reports');
}

export function exportProjectReportApi(projectId) {
  return request.post(`/reports/project/${projectId}/export`);
}