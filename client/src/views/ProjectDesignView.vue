<template>
  <AppLayout>
    <PageContainer
      :title="projectName"
      description="在这里配置阶段、拖入任务模板并调整执行顺序。"
    >
      <template #extra>
        <div class="design-actions">
          <el-button @click="openEditDialog">编辑项目</el-button>
          <el-button type="primary" @click="goExecution">进入执行页</el-button>
        </div>
      </template>

      <div class="design-page">
        <div class="design-left">
          <TaskTemplatePool
            :templates="taskTemplateStore.list"
            @append="handleAppendTemplate"
          />
        </div>

        <div class="design-right">
          <el-card class="project-hero">
            <div class="hero-top">
              <div>
                <div class="hero-eyebrow">PROJECT TARGET</div>
                <div class="hero-title">{{ projectStore.detail?.project?.name || '项目设计' }}</div>
                <div class="hero-subtitle">{{ projectStore.detail?.project?.target_url || '-' }}</div>
              </div>
              <StatusTag :text="projectStore.detail?.project?.status || ''" />
            </div>
          </el-card>

          <PhaseBoard
            :phases="phaseStore.phases"
            :tasks="phaseStore.tasks"
            @create-phase="handleCreatePhase"
            @summary-phase="handleSummaryPhase"
            @delete-phase="handleDeletePhase"
            @select-task="handleSelectTask"
            @execute-task="handleExecuteTask"
            @stop-task="handleStopTask"
            @remove-task="handleRemoveTask"
            @execute-phase="handleExecutePhase"
            @drop-item="handleDropItem"
            @rename-phase="handleRenamePhase"
          />
        </div>
      </div>

      <el-dialog
        v-model="editDialogVisible"
        title="编辑项目"
        width="720px"
      >
        <ProjectForm :model-value="editForm" @submit="handleUpdateProject" />
      </el-dialog>
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';

import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import TaskTemplatePool from '../components/task-template/TaskTemplatePool.vue';
import PhaseBoard from '../components/phase/PhaseBoard.vue';
import StatusTag from '../components/common/StatusTag.vue';
import ProjectForm from '../components/project/ProjectForm.vue';

import { useProjectStore } from '../store/modules/project';
import { usePhaseStore } from '../store/modules/phase';
import { useTaskTemplateStore } from '../store/modules/taskTemplate';
import { deleteProjectTaskApi } from '../api/tasks';
import { showError, showSuccess } from '../utils/message';
import { normalizeStatus } from '../utils/status';

const route = useRoute();
const router = useRouter();

const projectStore = useProjectStore();
const phaseStore = usePhaseStore();
const taskTemplateStore = useTaskTemplateStore();

const projectId = computed(() => Number(route.params.id));
const projectName = computed(() => projectStore.detail?.project?.name || '项目设计');

const editDialogVisible = ref(false);
const editForm = reactive({
  name: '',
  target_url: '',
  status: 'active',
  description: ''
});

onMounted(async () => {
  await Promise.all([
    projectStore.fetchProjectDetail(projectId.value),
    phaseStore.fetchPhases(projectId.value),
    phaseStore.fetchTasks(projectId.value),
    taskTemplateStore.fetchTemplates()
  ]);
});

async function refreshAll() {
  await Promise.all([
    projectStore.fetchProjectDetail(projectId.value),
    phaseStore.fetchPhases(projectId.value),
    phaseStore.fetchTasks(projectId.value)
  ]);
}

function goExecution() {
  router.push(`/projects/${projectId.value}/execution`);
}

function openEditDialog() {
  const project = projectStore.detail?.project;
  if (!project) return;

  editForm.name = project.name || '';
  editForm.target_url = project.target_url || '';
  editForm.status = normalizeStatus(project.status || 'active');
  editForm.description = project.description || '';

  editDialogVisible.value = true;
}

async function handleUpdateProject(form) {
  try {
    await projectStore.updateProject(projectId.value, {
      name: form.name,
      target_url: form.target_url,
      status: form.status,
      description: form.description
    });

    editDialogVisible.value = false;
    showSuccess('项目更新成功');
    await refreshAll();
  } catch (error) {
    showError(error.message);
  }
}

async function handleCreatePhase() {
  try {
    await phaseStore.createPhase(projectId.value, {
      name: `阶段 ${phaseStore.phases.length + 1}`
    });
    showSuccess('阶段创建成功');
    await refreshAll();
  } catch (error) {
    showError(error.message);
  }
}

async function handleRenamePhase(payload) {
  try {
    await phaseStore.updatePhase(payload.id, {
      name: payload.name
    });
    showSuccess('阶段名称已更新');
    await refreshAll();
  } catch (error) {
    showError(error.message);
  }
}

async function handleAppendTemplate(template) {
  try {
    const firstPhase = phaseStore.phases[0];
    if (!firstPhase) {
      showError('请先创建阶段');
      return;
    }

    await phaseStore.createTask(projectId.value, {
      phase_id: firstPhase.id,
      task_template_id: template.id
    });

    showSuccess('模板已加入首个阶段');
    await refreshAll();
  } catch (error) {
    showError(error.message);
  }
}

async function handleDropItem({ phaseId, insertIndex }) {
  try {
    const payload = window.__TASK_DND__;
    if (!payload) return;

    const currentTasks = [...phaseStore.tasks];
    const byPhase = phaseStore.phases.map((phase) => ({
      phaseId: phase.id,
      tasks: currentTasks
        .filter((item) => item.phase_id === phase.id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    }));

    if (payload.type === 'template') {
      await phaseStore.createTask(projectId.value, {
        phase_id: phaseId,
        task_template_id: payload.templateId,
        sort_order: insertIndex
      });
      await refreshAll();
    }

    if (payload.type === 'task') {
      const task = currentTasks.find((item) => item.id === payload.taskId);
      if (!task) return;

      const sourceGroup = byPhase.find((item) => item.phaseId === task.phase_id);
      const targetGroup = byPhase.find((item) => item.phaseId === phaseId);

      if (!sourceGroup || !targetGroup) return;

      sourceGroup.tasks = sourceGroup.tasks.filter((item) => item.id !== task.id);

      const movedTask = { ...task, phase_id: phaseId };
      targetGroup.tasks.splice(insertIndex, 0, movedTask);

      const reorderItems = [];
      for (const group of byPhase) {
        group.tasks.forEach((item, index) => {
          reorderItems.push({
            id: item.id,
            phase_id: group.phaseId,
            sort_order: index
          });
        });
      }

      await phaseStore.reorderTasks(projectId.value, reorderItems);
      await refreshAll();
    }

    window.__TASK_DND__ = null;
  } catch (error) {
    showError(error.message);
  }
}

async function handleSummaryPhase(phase) {
  try {
    await phaseStore.getPhaseDetail(phase.id);
    showSuccess('阶段摘要已刷新');
  } catch (error) {
    showError(error.message);
  }
}

async function handleDeletePhase(phase) {
  try {
    await ElMessageBox.confirm(`确认删除阶段「${phase.name}」吗？`, '删除确认', {
      type: 'warning'
    });

    await phaseStore.deletePhase(phase.id);
    showSuccess('阶段删除成功');
    await refreshAll();
  } catch (error) {
    if (error !== 'cancel') {
      showError(error.message || '删除失败');
    }
  }
}

async function handleSelectTask(task) {
  try {
    await phaseStore.getTaskLatestResult(task.id);
    router.push(`/projects/${projectId.value}/execution`);
  } catch (error) {
    showError(error.message);
  }
}

async function handleExecuteTask(task) {
  try {
    await phaseStore.executeTask(task.id);
    showSuccess('任务执行完成');
    await refreshAll();
  } catch (error) {
    showError(error.message);
  }
}

async function handleStopTask(task) {
  try {
    await phaseStore.stopTask(task.id);
    showSuccess('任务已停止');
    await refreshAll();
  } catch (error) {
    showError(error.message);
  }
}

async function handleRemoveTask(task) {
  try {
    await ElMessageBox.confirm(`确认删除任务「${task.name}」吗？`, '删除确认', {
      type: 'warning'
    });

    await deleteProjectTaskApi(task.id);
    showSuccess('任务删除成功');
    await refreshAll();
  } catch (error) {
    if (error !== 'cancel') {
      showError(error.message || '删除失败');
    }
  }
}

async function handleExecutePhase(phase) {
  try {
    await phaseStore.executePhase(phase.id);
    showSuccess('阶段执行完成');
    await refreshAll();
    router.push(`/projects/${projectId.value}/execution`);
  } catch (error) {
    showError(error.message);
  }
}
</script>

<style scoped>
.design-page {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 18px;
  min-height: calc(100vh - 180px);
}

.design-left,
.design-right {
  min-width: 0;
}

.design-right {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.design-actions {
  display: flex;
  gap: 10px;
}

.project-hero {
  background:
    linear-gradient(135deg, rgba(18, 115, 234, 0.08), rgba(6, 182, 212, 0.12)) !important;
}

.hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.hero-eyebrow {
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.16em;
  font-weight: 800;
}

.hero-title {
  margin-top: 10px;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.hero-subtitle {
  margin-top: 8px;
  color: var(--text-soft);
  word-break: break-word;
}

@media (max-width: 1100px) {
  .design-page {
    grid-template-columns: 1fr;
  }
}
</style>
