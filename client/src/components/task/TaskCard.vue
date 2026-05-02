<template>
  <div
    class="task-card"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="$emit('select', task)"
  >
    <div class="task-card__header">
      <div class="task-card__title">{{ task.name }}</div>
      <StatusTag :text="task.status" />
    </div>

    <div class="task-card__desc">{{ task.description || '暂无说明' }}</div>
    <div class="task-card__cmd">{{ task.command_template }}</div>

    <div class="task-card__actions">
      <el-button size="small" type="primary" @click.stop="$emit('execute', task)">执行</el-button>
      <el-button size="small" @click.stop="$emit('stop', task)">停止</el-button>
      <el-button size="small" type="danger" @click.stop="$emit('remove', task)">删除</el-button>
    </div>
  </div>
</template>

<script setup>
import StatusTag from '../common/StatusTag.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

defineEmits(['select', 'execute', 'stop', 'remove']);

function handleDragStart(event) {
  window.__TASK_DND__ = {
    type: 'task',
    taskId: props.task.id,
    fromPhaseId: props.task.phase_id
  };

  if (event?.target) {
    event.target.classList.add('drag-ghost');
  }
}

function handleDragEnd(event) {
  if (event?.target) {
    event.target.classList.remove('drag-ghost');
  }
}
</script>

<style scoped>
.task-card {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(18, 115, 234, 0.12);
  box-shadow: var(--shadow-sm);
  cursor: grab;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.task-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.task-card__title {
  font-weight: 800;
}

.task-card__desc {
  margin-top: 8px;
  color: var(--text-soft);
  font-size: 13px;
  line-height: 1.6;
}

.task-card__cmd {
  margin-top: 12px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(234, 241, 248, 0.78);
  font-size: 12px;
  word-break: break-all;
}

.task-card__actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
