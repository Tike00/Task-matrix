import request from './request';

export function getAuditLogsApi() {
  return request.get('/audit-logs');
}

export function deleteAuditLogApi(id) {
  return request.delete(`/audit-logs/${id}`);
}

export function clearAuditLogsApi() {
  return request.delete('/audit-logs');
}
