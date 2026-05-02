<template>
  <el-menu :default-active="route.path" router class="side-menu">
    <el-menu-item index="/dashboard">系统总览</el-menu-item>
    <el-menu-item index="/projects">项目管理</el-menu-item>
    <el-menu-item index="/task-templates">任务模板</el-menu-item>
    <el-menu-item index="/script-runner">脚本调试</el-menu-item>
    <el-menu-item index="/reports">报告中心</el-menu-item>
    <el-menu-item index="/audit-logs">审计日志</el-menu-item>
    <el-menu-item index="/settings">系统设置</el-menu-item>
    <el-menu-item index="/change-password">账号安全</el-menu-item>
  </el-menu>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped>
.side-menu {
  padding: 12px 8px;
}
</style>
