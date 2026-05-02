<template>
  <el-card>
    <template #header>
      <div class="panel-head">
        <div class="panel-title">最近审计记录</div>
        <div class="panel-subtitle">按时间查看关键执行动作</div>
      </div>
    </template>

    <el-table :data="data" size="small" border>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="action" label="动作" width="160" />
      <el-table-column prop="command_text" label="命令" min-width="220" />
      <el-table-column prop="created_at" label="时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.panel-subtitle {
  margin-top: 6px;
  color: var(--text-soft);
  font-size: 13px;
}
</style>
