const authService = require('../services/authService');
const { success } = require('../utils/response');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const data = await authService.login(username, password);
    return success(res, data, '登录成功');
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const data = await authService.getMe(req.user.id);
    return success(res, data);
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, oldPassword, newPassword);
    return success(res, true, '密码修改成功');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  me,
  changePassword
};
