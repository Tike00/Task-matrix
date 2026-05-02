const settingsService = require('../services/settingsService');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const data = await settingsService.listSettings();
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const allowedKeys = [
      'system_name',
      'listen_host',
      'listen_port',
      'jwt_expires_in',
      'allow_public_access',
      'default_report_type'
    ];

    const payload = {};
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        payload[key] = req.body[key];
      }
    }

    const data = await settingsService.updateSettings(payload);
    return success(res, data, '设置保存成功');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  update
};
