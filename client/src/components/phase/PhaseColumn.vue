<template>
  <el-card class="phase-column">
    <template #header>
      <div class="phase-column__header">
        <div class="phase-head">
          <template v-if="editingName">
            <el-input
              ref="nameInputRef"
              v-model="editableName"
              size="small"
              @blur="submitRename"
              @keyup.enter="submitRename"
              @keyup.esc="cancelRename"
            />
          </template>
          <template v-else>
            <div class="phase-name" @dblclick="startRename">
              {{ phase.name }}
            </div>
          </template>

          <div class="phase-desc">{{ phase.description || '将任务拖入这里，形成一个阶段执行序列。' }}</div>
        </div>

        <div class="phase-actions">
          <el-button size="small" @click="$emit('summary', phase)">刷新摘要</el-button>
          <el-button size="small" type="primary" @click="$emit('execute', phase)">执行阶段</el-button>
          <el-button size="small" type="danger" @click="$emit('delete', phase)">删除</el-button>
        </div>
      </div>
    </template>

    <div
      :class="['phase-drop-zone', activeDropIndex === 0 ? 'drag-highlight' : '']"
      @dragover.prevent.stop="setActiveDrop(0)"
      @dragleave.stop="clearActiveDrop"
      @drop.prevent.stop="handleDropAtIndex(0)"
    >
      拖到这里插入到顶部
    </div>

    <div class="phase-task-list">
      <template v-for="(task, index) in tasks" :key="task.id">
        <TaskCard
          :task="task"
          @select="$emit('select-task', $event)"
          @execute="$emit('execute-task', $event)"
          @stop="$emit('stop-task', $event)"
          @remove="$emit('remove-task', $event)"
        />

        <div
          :class="['phase-drop-zone', activeDropIndex === index + 1 ? 'drag-highlight' : '']"
          @dragover.prevent.stop="setActiveDrop(index + 1)"
          @dragleave.stop="clearActiveDrop"
          @drop.prevent.stop="handleDropAtIndex(index + 1)"
        >
          拖到这里插入
        </div>
      </template>
    </div>

    <div
      v-if="!tasks.length"
      :class="['phase-empty', activeDropIndex === -1 ? 'drag-highlight' : '']"
      @dragover.prevent.stop="setActiveDrop(-1)"
      @dragleave.stop="clearActiveDrop"
      @drop.prevent.stop="handleDropEmpty"
    >
      将模板或任务拖到这个阶段
    </div>
  </el-card>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import TaskCard from '../task/TaskCard.vue';

const props = defineProps({
  phase: {
    type: Object,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits([
  'execute',
  'summary',
  'delete',
  'select-task',
  'execute-task',
  'stop-task',
  'remove-task',
  'drop-item',
  'rename-phase'
]);

const editingName = ref(false);
const editableName = ref('');
const nameInputRef = ref(null);
const activeDropIndex = ref(null);

function startRename() {
  editingName.value = true;
  editableName.value = props.phase.name || '';
  nextTick(() => {
    nameInputRef.value?.focus?.();
  });
}

function cancelRename() {
  editingName.value = false;
  editableName.value = props.phase.name || '';
}

function submitRename() {
  const value = String(editableName.value || '').trim();
  editingName.value = false;

  if (!value || value === props.phase.name) return;

  emit('rename-phase', {
    id: props.phase.id,
    name: value
  });
}

function setActiveDrop(index) {
  activeDropIndex.value = index;
}

function clearActiveDrop() {
  activeDropIndex.value = null;
}

function handleDropAtIndex(index) {
  emit('drop-item', {
    phaseId: props.phase.id,
    insertIndex: index
  });
  clearActiveDrop();
}

function handleDropEmpty() {
  emit('drop-item', {
    phaseId: props.phase.id,
    insertIndex: 0
  });
  clearActiveDrop();
}
</script>

<style scoped>
.phase-column {
  min-width: 360px;
}

.phase-column__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.phase-head {
  min-width: 0;
  flex: 1;
}

.phase-name {
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
}

.phase-desc {
  margin-top: 6px;
  color: var(--text-soft);
  font-size: 13px;
  line-height: 1.6;
}

.phase-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.phase-task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.phase-drop-zone,
.phase-empty {
  border: 1px dashed rgba(18, 115, 234, 0.24);
  border-radius: 16px;
  padding: 12px;
  text-align: center;
  color: var(--text-muted);
  background: rgba(234, 241, 248, 0.5);
  transition: all 0.18s ease;
}

.phase-empty {
  min-height: 126px;
  display: grid;
  place-items: center;
}
</style>
