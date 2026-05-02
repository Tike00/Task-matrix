<template>
  <div class="empty-state">
    <el-empty :description="description" />
  </div>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default: '暂无数据'
  }
});
</script>

<style scoped>
.empty-state {
  padding: 24px 0;
}
</style>