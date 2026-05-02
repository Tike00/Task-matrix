const projectTaskService = require('../services/projectTaskService');
const taskExecutionService = require('../services/taskExecutionService');
const taskResultRepository = require('../db/repositories/taskResultRepository');
const sanitizeRepository = require('../db/repositories/sanitizeRepository');
const { success } = require('../utils/response');

async function listByProject(req, res, next) {
  try {
    const data = await projectTaskService.listProjectTasks(Number(req.params.projectId));
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await projectTaskService.createProjectTask(Number(req.params.projectId), req.body);
    return success(res, data, '任务添加成功');
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await projectTaskService.updateProjectTask(Number(req.params.id), req.body);
    return success(res, data, '任务更新成功');
  } catch (error) {
    next(error);
  }
}

async function reorder(req, res, next) {
  try {
    const data = await projectTaskService.reorderProjectTasks(
      Number(req.params.projectId),
      req.body.items || []
    );
    return success(res, data, '任务排序已保存');
  } catch (error) {
    next(error);
  }
}

async function move(req, res, next) {
  try {
    const data = await projectTaskService.moveProjectTask(
      Number(req.params.id),
      Number(req.body.target_phase_id),
      Number(req.body.sort_order || 0)
    );
    return success(res, data, '任务移动成功');
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await projectTaskService.deleteProjectTask(Number(req.params.id));
    return success(res, true, '任务删除成功');
  } catch (error) {
    next(error);
  }
}

async function execute(req, res, next) {
  try {
    const data = await taskExecutionService.executeProjectTask(Number(req.params.id), req.user);
    return success(res, data, '任务执行完成');
  } catch (error) {
    next(error);
  }
}

async function stop(req, res, next) {
  try {
    await taskExecutionService.stopProjectTask(Number(req.params.id));
    return success(res, true, '任务已停止');
  } catch (error) {
    next(error);
  }
}

async function results(req, res, next) {
  try {
    const data = await taskResultRepository.listByTaskId(Number(req.params.id));
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function latestResult(req, res, next) {
  try {
    const result = await taskResultRepository.findLatestByTaskId(Number(req.params.id));

    if (!result) {
      return success(res, null);
    }

    const mappings = await sanitizeRepository.listByTaskResultId(result.id);

    return success(res, {
      result,
      mappings
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listByProject,
  create,
  update,
  reorder,
  move,
  remove,
  execute,
  stop,
  results,
  latestResult
};
