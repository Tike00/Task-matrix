<template>
  <el-table :data="data" border>
    <el-table-column prop="id" label="ID" width="70" />
    <el-table-column prop="name" label="项目名称" min-width="180" />
    <el-table-column prop="target_url" label="目标 URL" min-width="240" />
    <el-table-column label="状态" width="120">
      <template #default="{ row }">
        <StatusTag :text="row.status" />
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="创建时间" min-width="180">
      <template #default="{ row }">
        {{ formatDateTime(row.created_at) }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="250" fixed="right">
      <template #default="{ row }">
        <el-button size="small" @click="$emit('view', row)">查看</el-button>
        <el-button size="small" type="primary" @click="$emit('edit', row)">设计</el-button>
        <el-button size="small" type="danger" @click="$emit('delete', row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import StatusTag from '../common/StatusTag.vue';
import { formatDateTime } from '../../utils/format';

defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

defineEmits(['view', 'edit', 'delete']);
</script>
