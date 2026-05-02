<template>
  <AppLayout>
    <PageContainer title="新建项目" description="创建一个新的目标项目，并进入任务设计页配置阶段与任务。">
      <ProjectForm @submit="handleSubmit" />
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import ProjectForm from '../components/project/ProjectForm.vue';
import { useProjectStore } from '../store/modules/project';
import { showError, showSuccess } from '../utils/message';

const router = useRouter();
const projectStore = useProjectStore();

async function handleSubmit(form) {
  try {
    const data = await projectStore.createProject(form);
    showSuccess('项目创建成功');
    router.push(`/projects/${data.id}/design`);
  } catch (error) {
    showError(error.message);
  }
}
</script>
