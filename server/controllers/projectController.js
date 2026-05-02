const projectService = require('../services/projectService');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const data = await projectService.listProjects();
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await projectService.createProject(req.body, req.user.id);
    return success(res, data, '项目创建成功');
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const data = await projectService.getProjectDetail(Number(req.params.id));
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await projectService.updateProject(Number(req.params.id), req.body);
    return success(res, data, '项目更新成功');
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await projectService.deleteProject(Number(req.params.id));
    return success(res, true, '项目删除成功');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  create,
  detail,
  update,
  remove
};
