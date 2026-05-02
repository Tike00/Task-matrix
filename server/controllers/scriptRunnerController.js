const scriptRunnerService = require('../services/scriptRunnerService');
const { success } = require('../utils/response');

function getRequestIp(req) {
  return req.ip || req.connection?.remoteAddress || '';
}

async function getConfig(req, res, next) {
  try {
    const config = await scriptRunnerService.getRunnerConfig();
    const status = scriptRunnerService.getRunnerStatus();

    return success(res, {
      ...config,
      running: status.running
    });
  } catch (error) {
    next(error);
  }
}

async function saveConfig(req, res, next) {
  try {
    const data = await scriptRunnerService.saveRunnerConfig(req.body);
    return success(res, data, 'script runner config saved');
  } catch (error) {
    next(error);
  }
}

async function status(req, res, next) {
  try {
    const data = scriptRunnerService.getRunnerStatus();
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function uploadPythonScript(req, res, next) {
  try {
    const data = await scriptRunnerService.uploadPythonScript({
      filename: req.body.filename,
      file_content_base64: req.body.file_content_base64,
      user: req.user,
      request_ip: getRequestIp(req)
    });

    return success(res, data, 'python script uploaded');
  } catch (error) {
    next(error);
  }
}

async function execute(req, res, next) {
  try {
    const data = await scriptRunnerService.executeScriptCommand({
      command_text: req.body.command_text,
      user: req.user,
      request_ip: getRequestIp(req)
    });

    return success(res, data, 'script command completed');
  } catch (error) {
    next(error);
  }
}

async function stop(req, res, next) {
  try {
    const data = await scriptRunnerService.stopScriptCommand({
      id: req.body.id || req.params.id,
      user: req.user,
      request_ip: getRequestIp(req)
    });

    return success(res, data, 'script command stopped');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getConfig,
  saveConfig,
  status,
  uploadPythonScript,
  execute,
  stop
};
