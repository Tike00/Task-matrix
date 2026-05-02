<template>
  <el-card>
    <template #header>
      <div class="panel-head">
        <div class="panel-title">最近项目</div>
        <div class="panel-subtitle">最近创建或更新的项目入口</div>
      </div>
    </template>

    <el-table :data="data" size="small" border>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="项目名称" min-width="180" />
      <el-table-column prop="target_url" label="目标 URL" min-width="220" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <StatusTag :text="row.status" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import StatusTag from '../common/StatusTag.vue';

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
