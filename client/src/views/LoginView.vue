<template>
  <div class="login-page">
    <div class="login-backdrop"></div>
    <div class="login-shell">
      <section class="login-copy">
        <div class="login-badge">LOCAL EXECUTION STACK</div>
        <h1>在一台机器上完成任务编排、执行与审计。</h1>
        <p>
          这里保留了项目管理、任务模板、阶段调度、报告导出和脚本调试能力，
          适合本地安全巡检或自动化任务排程场景。
        </p>
      </section>

      <LoginForm />
    </div>
  </div>
</template>

<script setup>
import LoginForm from '../components/auth/LoginForm.vue';
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.login-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 18%, rgba(18, 115, 234, 0.2), transparent 20%),
    radial-gradient(circle at 82% 22%, rgba(6, 182, 212, 0.18), transparent 18%);
}

.login-shell {
  position: relative;
  z-index: 1;
  width: min(1080px, 100%);
  display: grid;
  grid-template-columns: 1.05fr 420px;
  gap: 28px;
  align-items: stretch;
}

.login-copy {
  padding: 42px;
  border: 1px solid var(--line-main);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-lg);
}

.login-badge {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(18, 115, 234, 0.1);
  color: var(--primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.login-copy h1 {
  margin: 22px 0 0;
  font-size: clamp(36px, 5vw, 58px);
  line-height: 1.02;
  letter-spacing: -0.06em;
}

.login-copy p {
  margin: 22px 0 0;
  max-width: 560px;
  color: var(--text-soft);
  font-size: 17px;
  line-height: 1.8;
}

@media (max-width: 960px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-copy {
    padding: 28px;
  }
}
</style>
