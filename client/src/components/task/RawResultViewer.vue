<template>
  <el-card class="result-card">
    <template #header>
      <div class="panel-title">任务结果</div>
    </template>

    <template v-if="result">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="退出码">
          {{ result.exit_code ?? '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ result.started_at || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ result.finished_at || '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="section">
        <div class="section-title">raw_output</div>
        <pre class="terminal-block">{{ result.raw_output || '' }}</pre>
      </div>

      <div class="section">
        <div class="section-title">stdout</div>
        <pre class="terminal-block">{{ result.stdout || '' }}</pre>
      </div>

      <div class="section">
        <div class="section-title">stderr</div>
        <pre class="terminal-block">{{ result.stderr || '' }}</pre>
      </div>
    </template>

    <el-empty v-else description="暂无任务结果" />
  </el-card>
</template>

<script setup>
defineProps({
  result: {
    type: Object,
    default: null
  }
});
</script>

<style scoped>
.result-card {
  height: 100%;
}

.section {
  margin-top: 16px;
}

.section-title {
  font-weight: 800;
  margin-bottom: 8px;
}
</style>
