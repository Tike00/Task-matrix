<template>
  <AppLayout>
    <PageContainer
      :title="projectName"
      description="查看原始结果、阶段摘要和实时执行日志。"
    >
      <template #extra>
        <div class="page-actions">
          <el-button @click="goDesign">返回设计页</el-button>
        </div>
      </template>

      <div class="execution-page">
        <div class="execution-left">
          <el-card class="side-card">
            <template #header>
              <div class="panel-title">阶段列表</div>
            </template>

            <div class="phase-list">
              <div
                v-for="phase in phaseStore.phases"
                :key="phase.id"
                :class="['phase-item', selectedPhaseId === phase.id ? 'active' : '']"
                @click="handleSelectPhase(phase)"
              >
                <div class="phase-item__name">{{ phase.name }}</div>
                <div class="phase-item__meta">{{ phase.status }}</div>
              </div>
            </div>
          </el-card>
        </div>

        <div class="execution-center">
          <RawResultViewer :result="selectedResult" />
          <PhaseSummaryPanel :phase="selectedPhase" />
          <ExecutionLogPanel :logs="wsStore.logs" @clear="wsStore.clearLogs" />
        </div>
      </div>
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import RawResultViewer from '../components/task/RawResultViewer.vue';
import ExecutionLogPanel from '../components/task/ExecutionLogPanel.vue';
import PhaseSummaryPanel from '../components/phase/PhaseSummaryPanel.vue';

import { useProjectStore } from '../store/modules/project';
import { usePhaseStore } from '../store/modules/phase';
import { useWsStore } from '../store/modules/ws';
import { showError } from '../utils/message';

const route = useRoute();
const router = useRouter();

const projectStore = useProjectStore();
const phaseStore = usePhaseStore();
const wsStore = useWsStore();

const selectedPhaseId = ref(null);

const projectId = computed(() => Number(route.params.id));
const projectName = computed(() => projectStore.detail?.project?.name || '项目执行');

const selectedResult = computed(() => phaseStore.activeTaskResult?.result || null);
const selectedPhase = computed(() => {
  if (!selectedPhaseId.value) return null;
  return phaseStore.phases.find((item) => item.id === selectedPhaseId.value) || null;
});

onMounted(async () => {
  wsStore.connect();

  await Promise.all([
    projectStore.fetchProjectDetail(projectId.value),
    phaseStore.fetchPhases(projectId.value),
    phaseStore.fetchTasks(projectId.value)
  ]);

  if (phaseStore.phases.length > 0) {
    selectedPhaseId.value = phaseStore.phases[0].id;
    await phaseStore.getPhaseDetail(selectedPhaseId.value);

    const firstTask = phaseStore.tasks.find((item) => item.phase_id === selectedPhaseId.value);
    if (firstTask) {
      await phaseStore.getTaskLatestResult(firstTask.id);
    }
  }
});

function goDesign() {
  router.push(`/projects/${projectId.value}/design`);
}

async function handleSelectPhase(phase) {
  try {
    selectedPhaseId.value = phase.id;
    await phaseStore.getPhaseDetail(phase.id);

    const firstTask = phaseStore.tasks.find((item) => item.phase_id === phase.id);
    if (firstTask) {
      await phaseStore.getTaskLatestResult(firstTask.id);
    } else {
      phaseStore.activeTaskResult = null;
    }
  } catch (error) {
    showError(error.message);
  }
}
</script>

<style scoped>
.execution-page {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 18px;
  min-height: calc(100vh - 180px);
}

.execution-center {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-content: start;
}

.phase-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.phase-item {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid transparent;
  cursor: pointer;
}

.phase-item.active {
  border-color: rgba(18, 115, 234, 0.34);
  box-shadow: 0 0 0 4px rgba(18, 115, 234, 0.08);
}

.phase-item__name {
  font-weight: 800;
}

.phase-item__meta {
  margin-top: 6px;
  color: var(--text-soft);
  font-size: 12px;
}

@media (max-width: 1200px) {
  .execution-page {
    grid-template-columns: 1fr;
  }

  .execution-center {
    grid-template-columns: 1fr;
  }
}
</style>
