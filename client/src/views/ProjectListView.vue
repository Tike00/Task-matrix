<template>
  <AppLayout>
    <PageContainer title="项目管理" description="维护目标项目、进入任务设计页并查看执行结果。">
      <template #extra>
        <el-button type="primary" @click="router.push('/projects/new')">新建项目</el-button>
      </template>

      <ProjectTable
        :data="projectStore.list"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import ProjectTable from '../components/project/ProjectTable.vue';
import { useProjectStore } from '../store/modules/project';
import { showError, showSuccess } from '../utils/message';

const router = useRouter();
const projectStore = useProjectStore();

onMounted(async () => {
  await projectStore.fetchProjects();
});

function handleView(row) {
  router.push(`/projects/${row.id}/design`);
}

function handleEdit(row) {
  router.push(`/projects/${row.id}/design`);
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除项目「${row.name}」吗？`, '删除确认', {
      type: 'warning'
    });

    await projectStore.deleteProject(row.id);
    showSuccess('项目删除成功');
    await projectStore.fetchProjects();
  } catch (error) {
    if (error !== 'cancel') {
      showError(error.message || '删除失败');
    }
  }
}
</script>
