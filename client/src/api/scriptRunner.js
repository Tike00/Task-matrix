import request from './request';

export function getScriptRunnerConfigApi() {
  return request.get('/script-runner/config');
}

export function saveScriptRunnerConfigApi(data) {
  return request.put('/script-runner/config', data);
}

export function getScriptRunnerStatusApi() {
  return request.get('/script-runner/status');
}

export function uploadPythonScriptApi(data) {
  return request.post('/script-runner/python-scripts', data);
}

export function executeScriptRunnerApi(data) {
  return request.post('/script-runner/execute', data, {
    timeout: 26 * 60 * 1000
  });
}

export function stopScriptRunnerCommandApi(id) {
  return request.post(`/script-runner/commands/${id}/stop`);
}
