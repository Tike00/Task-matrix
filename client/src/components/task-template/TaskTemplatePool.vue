<template>
  <el-card class="pool-card">
    <template #header>
      <div class="panel-title">模板池</div>
    </template>

    <div class="template-list">
      <div
        v-for="item in templates"
        :key="item.id"
        class="template-item"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @dragend="handleDragEnd"
      >
        <div class="template-head">
          <div class="template-name">{{ item.name }}</div>
          <div class="template-phase">{{ item.phase_name || '未分组' }}</div>
        </div>
        <div class="template-desc">{{ item.description || '暂无描述' }}</div>
        <div class="template-cmd">{{ item.command_template }}</div>
        <div class="template-hint">拖到右侧阶段栏，或直接快速添加。</div>
        <el-button type="primary" size="small" @click="$emit('append', item)">快速添加</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  templates: {
    type: Array,
    default: () => []
  }
});

defineEmits(['append']);

function handleDragStart(event, item) {
  window.__TASK_DND__ = {
    type: 'template',
    templateId: item.id
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
.pool-card {
  height: 100%;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.template-item {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(18, 115, 234, 0.12);
  box-shadow: var(--shadow-sm);
  cursor: grab;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.template-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.template-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.template-name {
  font-weight: 800;
}

.template-phase {
  font-size: 12px;
  color: var(--accent);
}

.template-desc {
  margin-top: 8px;
  color: var(--text-soft);
  font-size: 13px;
  line-height: 1.6;
}

.template-cmd {
  margin-top: 12px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(234, 241, 248, 0.78);
  color: var(--text-main);
  font-size: 12px;
  word-break: break-all;
}

.template-hint {
  margin: 12px 0 10px;
  color: var(--text-muted);
  font-size: 12px;
}
</style>
