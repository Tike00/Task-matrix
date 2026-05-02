<template>
  <el-card class="phase-summary-panel">
    <template #header>
      <div class="panel-title">阶段摘要</div>
    </template>

    <template v-if="phase">
      <div class="summary-meta">
        <div class="meta-item">
          <div class="meta-label">阶段名称</div>
          <div class="meta-value">{{ phase.name }}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">阶段状态</div>
          <div class="meta-value">{{ phase.status }}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">最后执行时间</div>
          <div class="meta-value">{{ phase.last_executed_at || '-' }}</div>
        </div>
      </div>

      <div class="summary-block">
        <div class="summary-title">原始摘要</div>
        <pre class="terminal-block">{{ phase.raw_summary || '' }}</pre>
      </div>

      <div class="summary-block">
        <div class="summary-title">脱敏摘要</div>
        <pre class="terminal-block">{{ phase.sanitized_summary || '' }}</pre>
      </div>
    </template>

    <el-empty v-else description="请选择阶段查看摘要" />
  </el-card>
</template>

<script setup>
defineProps({
  phase: {
    type: Object,
    default: null
  }
});
</script>

<style scoped>
.phase-summary-panel {
  height: 100%;
}

.summary-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.meta-item {
  padding: 14px;
  border-radius: 18px;
  background: rgba(234, 241, 248, 0.56);
}

.meta-label {
  font-size: 12px;
  color: var(--text-soft);
}

.meta-value {
  margin-top: 6px;
  font-weight: 800;
  word-break: break-word;
}

.summary-block {
  margin-top: 16px;
}

.summary-title {
  margin-bottom: 8px;
  font-weight: 800;
}

@media (max-width: 960px) {
  .summary-meta {
    grid-template-columns: 1fr;
  }
}
</style>
