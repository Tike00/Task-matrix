<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand-panel">
        <div class="brand-mark">
          <span></span>
        </div>
        <div class="brand-copy">
          <div class="brand-title">Task Matrix</div>
          <div class="brand-subtitle">Local Execution Console</div>
        </div>
      </div>

      <SidebarMenu />
    </aside>

    <div class="app-main">
      <TopNavbar />
      <main class="app-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import SidebarMenu from '../components/common/SidebarMenu.vue';
import TopNavbar from '../components/common/TopNavbar.vue';
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}

.app-sidebar {
  width: 292px;
  padding: 20px 16px;
  border-right: 1px solid var(--line-main);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(245, 250, 255, 0.74));
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  align-self: flex-start;
  min-height: 100vh;
}

.brand-panel {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 8px 22px;
}

.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(18, 115, 234, 0.18), rgba(6, 182, 212, 0.22));
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 1px rgba(18, 115, 234, 0.18);
}

.brand-mark span {
  width: 22px;
  height: 22px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  box-shadow: 0 10px 22px rgba(18, 115, 234, 0.26);
}

.brand-title {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.brand-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-soft);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.app-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

@media (max-width: 960px) {
  .app-shell {
    flex-direction: column;
  }

  .app-sidebar {
    width: 100%;
    min-height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--line-main);
  }
}
</style>
