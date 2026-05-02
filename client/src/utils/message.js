import { ElMessage } from 'element-plus';

export function showSuccess(message) {
  ElMessage.success(message);
}

export function showError(message) {
  ElMessage.error(message);
}