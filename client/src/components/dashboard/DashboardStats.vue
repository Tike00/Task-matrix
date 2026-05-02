<template>
  <div class="stats-grid">
    <el-card class="stat-card">
      <div class="stat-label">项目总数</div>
      <div class="stat-value">{{ projectCount }}</div>
      <div class="stat-foot">当前纳管项目</div>
    </el-card>

    <el-card class="stat-card stat-card--accent">
      <div class="stat-label">活跃项目</div>
      <div class="stat-value">{{ runningCount }}</div>
      <div class="stat-foot">正在推进或执行中</div>
    </el-card>

    <el-card class="stat-card">
      <div class="stat-label">模板数量</div>
      <div class="stat-value">{{ templateCount }}</div>
      <div class="stat-foot">可拖入任务池</div>
    </el-card>
  </div>
</template>

<script setup>
defineProps({
  projectCount: Number,
  runningCount: Number,
  templateCount: Number
});
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-card::after {
  content: '';
  position: absolute;
  inset: auto -20% -36% auto;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(18, 115, 234, 0.08);
}

.stat-card--accent::after {
  background: rgba(6, 182, 212, 0.1);
}

.stat-label {
  color: var(--text-soft);
  font-weight: 700;
}

.stat-value {
  margin-top: 16px;
  font-size: 40px;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.stat-foot {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 13px;
}

@media (max-width: 960px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
