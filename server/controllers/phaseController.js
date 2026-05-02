const phaseService = require('../services/phaseService');
const taskExecutionService = require('../services/taskExecutionService');
const { success } = require('../utils/response');

async function listByProject(req, res, next) {
  try {
    const data = await phaseService.listPhases(Number(req.params.projectId));
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await phaseService.createPhase(Number(req.params.projectId), req.body);
    return success(res, data, '阶段创建成功');
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await phaseService.updatePhase(Number(req.params.id), req.body);
    return success(res, data, '阶段更新成功');
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await phaseService.deletePhase(Number(req.params.id));
    return success(res, true, '阶段删除成功');
  } catch (error) {
    next(error);
  }
}

async function reorder(req, res, next) {
  try {
    const data = await phaseService.reorderPhases(Number(req.params.projectId), req.body.items || []);
    return success(res, data, '阶段排序已保存');
  } catch (error) {
    next(error);
  }
}

async function execute(req, res, next) {
  try {
    const data = await taskExecutionService.executePhase(Number(req.params.id), req.user);
    return success(res, data, '阶段执行完成');
  } catch (error) {
    next(error);
  }
}

async function summary(req, res, next) {
  try {
    const data = await phaseService.rebuildPhaseSummary(Number(req.params.id));
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const data = await phaseService.getPhaseDetail(Number(req.params.id));
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listByProject,
  create,
  update,
  remove,
  reorder,
  execute,
  summary,
  detail
};
