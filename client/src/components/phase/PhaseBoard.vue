<template>
  <div class="phase-board">
    <div class="phase-board__toolbar">
      <el-button type="primary" @click="$emit('create-phase')">新建阶段</el-button>
    </div>

    <div class="phase-board__columns">
      <PhaseColumn
        v-for="phase in phases"
        :key="phase.id"
        :phase="phase"
        :tasks="getTasks(phase.id)"
        @execute="$emit('execute-phase', $event)"
        @summary="$emit('summary-phase', $event)"
        @delete="$emit('delete-phase', $event)"
        @select-task="$emit('select-task', $event)"
        @execute-task="$emit('execute-task', $event)"
        @stop-task="$emit('stop-task', $event)"
        @remove-task="$emit('remove-task', $event)"
        @drop-item="payload => $emit('drop-item', payload)"
        @rename-phase="payload => $emit('rename-phase', payload)"
      />
    </div>
  </div>
</template>

<script setup>
import PhaseColumn from './PhaseColumn.vue';

const props = defineProps({
  phases: {
    type: Array,
    default: () => []
  },
  tasks: {
    type: Array,
    default: () => []
  }
});

defineEmits([
  'create-phase',
  'execute-phase',
  'summary-phase',
  'delete-phase',
  'select-task',
  'execute-task',
  'stop-task',
  'remove-task',
  'drop-item',
  'rename-phase'
]);

function getTasks(phaseId) {
  return props.tasks.filter((item) => item.phase_id === phaseId);
}
</script>

<style scoped>
.phase-board {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.phase-board__toolbar {
  display: flex;
  justify-content: flex-end;
}

.phase-board__columns {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 6px;
}
</style>
