<template>
  <header class="topbar">
    <div>
      <div class="eyebrow">LOCAL MODE</div>
      <div class="title">本地任务调度与执行平台</div>
    </div>

    <div class="topbar-actions">
      <div class="user-chip">
        <span class="user-label">当前账号</span>
        <span class="user-name">{{ authStore.user?.username || 'admin' }}</span>
      </div>
      <el-button size="small" @click="handleLogout">退出登录</el-button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/modules/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--line-main);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);
}

.eyebrow {
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.18em;
  font-weight: 800;
}

.title {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 800;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-chip {
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(18, 115, 234, 0.12);
}

.user-label {
  font-size: 11px;
  color: var(--text-muted);
}

.user-name {
  margin-top: 4px;
  font-weight: 800;
  color: var(--primary-strong);
}

@media (max-width: 960px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
