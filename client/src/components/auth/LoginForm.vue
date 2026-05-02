<template>
  <el-card class="login-card">
    <template #header>
      <div class="login-card__title">安全登录</div>
      <div class="login-card__desc">进入本地任务平台</div>
    </template>

    <el-form :model="form" label-position="top" @submit.prevent="handleSubmit">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          show-password
          type="password"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="authStore.loading"
          style="width: 100%;"
          @click="handleSubmit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>

    <div class="login-tip">默认初始化账号通常为 `admin / admin`，首次进入后建议立即修改。</div>
  </el-card>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/modules/auth';
import { showError, showSuccess } from '../../utils/message';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: 'admin',
  password: 'admin'
});

async function handleSubmit() {
  try {
    await authStore.login(form);
    showSuccess('登录成功');
    router.push('/dashboard');
  } catch (error) {
    showError(error.message);
  }
}
</script>

<style scoped>
.login-card {
  min-height: 100%;
}

.login-card__title {
  font-size: 24px;
  font-weight: 900;
}

.login-card__desc {
  margin-top: 8px;
  color: var(--text-soft);
}

.login-tip {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-muted);
}
</style>
