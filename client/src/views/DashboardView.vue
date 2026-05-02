<template>
  <AppLayout>
    <PageContainer title="系统总览" description="快速查看项目规模、当前执行状态和最近产生的关键操作记录。">
      <div class="dashboard-layout">
        <DashboardStats
          :project-count="projects.length"
          :running-count="runningCount"
          :template-count="templates.length"
        />

        <div class="dashboard-grid">
          <RecentProjects :data="recentProjects" />
          <AuditSummary :data="recentAuditLogs" />
        </div>
      </div>
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import DashboardStats from '../components/dashboard/DashboardStats.vue';
import RecentProjects from '../components/dashboard/RecentProjects.vue';
import AuditSummary from '../components/dashboard/AuditSummary.vue';
import { useProjectStore } from '../store/modules/project';
import { useTaskTemplateStore } from '../store/modules/taskTemplate';
import { getAuditLogsApi } from '../api/audit';
import { showError } from '../utils/message';
import { isRunningStatus } from '../utils/status';

const projectStore = useProjectStore();
const taskTemplateStore = useTaskTemplateStore();
const recentAuditLogs = ref([]);

const projects = computed(() => projectStore.list);
const templates = computed(() => taskTemplateStore.list);
const runningCount = computed(() => projects.value.filter((item) => isRunningStatus(item.status)).length);
const recentProjects = computed(() => projects.value.slice(0, 8));

onMounted(async () => {
  try {
    await Promise.all([
      projectStore.fetchProjects(),
      taskTemplateStore.fetchTemplates()
    ]);

    const res = await getAuditLogsApi();
    recentAuditLogs.value = (res.data || []).slice(0, 8);
  } catch (error) {
    showError(error.message);
  }
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
