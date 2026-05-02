import request from './request';

export function getTaskTemplatesApi() {
  return request.get('/task-templates');
}

export function createTaskTemplateApi(data) {
  return request.post('/task-templates', data);
}

export function updateTaskTemplateApi(id, data) {
  return request.put(`/task-templates/${id}`, data);
}

export function deleteTaskTemplateApi(id) {
  return request.delete(`/task-templates/${id}`);
}