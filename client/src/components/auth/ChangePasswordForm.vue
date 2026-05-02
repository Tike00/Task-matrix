<template>
  <el-card>
    <el-form :model="form" label-width="120px">
      <el-form-item label="旧密码">
        <el-input v-model="form.oldPassword" type="password" show-password />
      </el-form-item>

      <el-form-item label="新密码">
        <el-input v-model="form.newPassword" type="password" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '../../store/modules/auth';
import { showError, showSuccess } from '../../utils/message';

const authStore = useAuthStore();

const form = reactive({
  oldPassword: '',
  newPassword: ''
});

async function handleSubmit() {
  try {
    await authStore.changePassword(form);
    form.oldPassword = '';
    form.newPassword = '';
    showSuccess('密码修改成功');
  } catch (error) {
    showError(error.message);
  }
}
</script>
