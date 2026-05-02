<template>
  <AppLayout>
    <PageContainer title="报告中心" description="导出项目报告，并查看已有报告记录。">
      <el-card class="report-toolbar">
        <el-form inline>
          <el-form-item label="选择项目">
            <el-select v-model="selectedProjectId" placeholder="请选择项目" style="width: 260px;">
              <el-option
                v-for="item in projectStore.list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleExport">导出报告</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <ReportHistoryTable :data="reports" />
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import ReportHistoryTable from '../components/report/ReportHistoryTable.vue';
import { useProjectStore } from '../store/modules/project';
import { getReportsApi, exportProjectReportApi } from '../api/reports';
import { showError, showSuccess } from '../utils/message';

const projectStore = useProjectStore();
const reports = ref([]);
const selectedProjectId = ref(null);

onMounted(async () => {
  await projectStore.fetchProjects();
  await fetchReports();
});

async function fetchReports() {
  try {
    const res = await getReportsApi();
    reports.value = res.data || [];
  } catch (error) {
    showError(error.message);
  }
}

async function handleExport() {
  try {
    if (!selectedProjectId.value) {
      showError('请先选择项目');
      return;
    }

    await exportProjectReportApi(selectedProjectId.value);
    showSuccess('报告导出成功');
    await fetchReports();
  } catch (error) {
    showError(error.message);
  }
}
</script>

<style scoped>
.report-toolbar {
  margin-bottom: 16px;
}
</style>
