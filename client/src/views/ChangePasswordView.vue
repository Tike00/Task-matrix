<template>
  <AppLayout>
    <PageContainer title="账号安全" description="修改当前登录账号的密码。">
      <ChangePasswordForm />
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import ChangePasswordForm from '../components/auth/ChangePasswordForm.vue';
</script>
