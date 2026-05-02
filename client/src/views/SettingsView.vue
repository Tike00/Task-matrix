<template>
  <AppLayout>
    <PageContainer title="系统设置" description="维护本地服务的通用配置项，不再包含聊天或外部 AI 设置。">
      <SettingsForm :settings="settingsStore.list" @submit="handleSubmit" />
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import SettingsForm from '../components/settings/SettingsForm.vue';
import { useSettingsStore } from '../store/modules/settings';
import { showError, showSuccess } from '../utils/message';

const settingsStore = useSettingsStore();

onMounted(async () => {
  await settingsStore.fetchSettings();
});

async function handleSubmit(form) {
  try {
    await settingsStore.updateSettings(form);
    showSuccess('设置保存成功');
  } catch (error) {
    showError(error.message);
  }
}
</script>
