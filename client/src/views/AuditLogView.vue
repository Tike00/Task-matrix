<template>
  <AppLayout>
    <PageContainer title="审计日志" description="按时间查看任务执行与关键操作日志。">
      <AuditLogTable
        :data="logs"
        @delete="handleDeleteLog"
        @clear="handleClearLogs"
      />
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import AuditLogTable from '../components/audit/AuditLogTable.vue';
import {
  clearAuditLogsApi,
  deleteAuditLogApi,
  getAuditLogsApi
} from '../api/audit';
import { showError, showSuccess } from '../utils/message';

const logs = ref([]);

onMounted(loadLogs);

async function loadLogs() {
  try {
    const res = await getAuditLogsApi();
    logs.value = res.data || [];
  } catch (error) {
    showError(error.message);
  }
}

async function handleDeleteLog(row) {
  try {
    await ElMessageBox.confirm(`确认删除审计日志 #${row.id}？`, '删除确认', {
      type: 'warning'
    });
    await deleteAuditLogApi(row.id);
    showSuccess('审计日志已删除');
    await loadLogs();
  } catch (error) {
    if (error !== 'cancel') {
      showError(error.message || String(error));
    }
  }
}

async function handleClearLogs() {
  try {
    await ElMessageBox.confirm('确认清空全部审计日志？', '清空确认', {
      type: 'warning'
    });
    await clearAuditLogsApi();
    showSuccess('审计日志已清空');
    await loadLogs();
  } catch (error) {
    if (error !== 'cancel') {
      showError(error.message || String(error));
    }
  }
}
</script>
