const auditLogService = require('../services/auditLogService');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const data = await auditLogService.listAuditLogs();
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const data = await auditLogService.deleteAuditLog(req.params.id);
    return success(res, data, 'audit log deleted');
  } catch (error) {
    next(error);
  }
}

async function clear(req, res, next) {
  try {
    const data = await auditLogService.deleteAllAuditLogs();
    return success(res, data, 'audit logs cleared');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  remove,
  clear
};
