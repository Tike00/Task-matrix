<template>
  <el-card>
    <template #header>
      <div class="audit-header">
        <div class="panel-title">审计明细</div>
        <el-button type="danger" plain @click="$emit('clear')">清空日志</el-button>
      </div>
    </template>

    <el-table :data="data" border>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="user_id" label="用户 ID" width="90" />
      <el-table-column prop="project_id" label="项目 ID" width="90" />
      <el-table-column prop="phase_id" label="阶段 ID" width="90" />
      <el-table-column prop="project_task_id" label="任务 ID" width="90" />
      <el-table-column prop="action" label="动作" width="190" />
      <el-table-column prop="command_text" label="命令" min-width="240" />
      <el-table-column prop="details" label="详情" min-width="240" />
      <el-table-column prop="ip_address" label="IP" width="140" />
      <el-table-column prop="created_at" label="时间" min-width="180" />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button type="danger" link @click="$emit('delete', row)">删除</el-button>
        </template>
      </el-table-column>
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

defineEmits(['delete', 'clear']);
</script>

<style scoped>
.audit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>
