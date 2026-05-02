<template>
  <el-card class="log-panel">
    <template #header>
      <div class="log-panel__header">
        <span class="panel-title">实时执行日志</span>
        <el-button size="small" @click="$emit('clear')">清空</el-button>
      </div>
    </template>

    <div class="log-list terminal-block">
      <div v-for="(item, index) in logs" :key="index" class="log-item">
        <span class="log-meta">[{{ item.stream || item.type }}][任务 {{ item.taskId || '-' }}]</span>
        <span class="log-text">{{ item.message || JSON.stringify(item) }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  logs: {
    type: Array,
    default: () => []
  }
});

defineEmits(['clear']);
</script>

<style scoped>
.log-panel {
  height: 100%;
}

.log-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-list {
  max-height: 280px;
  overflow: auto;
}

.log-item {
  font-size: 12px;
  margin-bottom: 8px;
  word-break: break-word;
}

.log-meta {
  color: #7fd0ff;
  margin-right: 8px;
}
</style>
