<template>
  <el-card>
    <el-form :model="form" label-width="180px">
      <el-form-item label="系统名称">
        <el-input v-model="form.system_name" />
      </el-form-item>

      <el-form-item label="监听地址">
        <el-input v-model="form.listen_host" />
      </el-form-item>

      <el-form-item label="监听端口">
        <el-input v-model="form.listen_port" />
      </el-form-item>

      <el-form-item label="JWT 有效期">
        <el-input v-model="form.jwt_expires_in" />
      </el-form-item>

      <el-form-item label="默认报告类型">
        <el-input v-model="form.default_report_type" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="$emit('submit', form)">保存设置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  settings: {
    type: Array,
    default: () => []
  }
});

defineEmits(['submit']);

const form = reactive({
  system_name: '',
  listen_host: '',
  listen_port: '',
  jwt_expires_in: '',
  default_report_type: ''
});

watch(
  () => props.settings,
  (list) => {
    const map = {};
    (list || []).forEach((item) => {
      map[item.setting_key] = item.setting_value;
    });

    form.system_name = map.system_name || '';
    form.listen_host = map.listen_host || '';
    form.listen_port = map.listen_port || '';
    form.jwt_expires_in = map.jwt_expires_in || '';
    form.default_report_type = map.default_report_type || '';
  },
  { immediate: true, deep: true }
);
</script>
