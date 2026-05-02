const taskTemplateService = require('../services/taskTemplateService');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const data = await taskTemplateService.listTemplates();
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const payload = {
      ...req.body,
      enabled_by_default: !!req.body.enabled_by_default,
      is_active: req.body.is_active === undefined ? true : !!req.body.is_active
    };

    const data = await taskTemplateService.createTemplate(payload);
    return success(res, data, '模板创建成功');
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const payload = {
      ...req.body,
      enabled_by_default: req.body.enabled_by_default === undefined
        ? undefined
        : !!req.body.enabled_by_default,
      is_active: req.body.is_active === undefined
        ? undefined
        : !!req.body.is_active
    };

    const data = await taskTemplateService.updateTemplate(Number(req.params.id), payload);
    return success(res, data, '模板更新成功');
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await taskTemplateService.deleteTemplate(Number(req.params.id));
    return success(res, true, '模板删除成功');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  create,
  update,
  remove
};
