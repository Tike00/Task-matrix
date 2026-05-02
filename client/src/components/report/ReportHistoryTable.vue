<template>
  <el-card>
    <template #header>
      <div class="panel-title">报告历史</div>
    </template>

    <el-table :data="data" border>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="标题" min-width="220" />
      <el-table-column prop="report_type" label="类型" width="140" />
      <el-table-column prop="file_path" label="文件路径" min-width="320" />
      <el-table-column prop="exported_at" label="导出时间" min-width="180" />
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
