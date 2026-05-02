const reportService = require('../services/reportService');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const data = await reportService.listReports();
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function exportProjectReport(req, res, next) {
  try {
    const data = await reportService.exportProjectReport(Number(req.params.projectId), req.user.id);
    return success(res, data, '报告导出成功');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  exportProjectReport
};
