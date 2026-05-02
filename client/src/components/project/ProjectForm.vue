<template>
  <el-card>
    <el-form :model="form" label-width="120px">
      <el-form-item label="项目名称">
        <el-input v-model="form.name" placeholder="请输入项目名称" />
      </el-form-item>

      <el-form-item label="目标 URL">
        <el-input v-model="form.target_url" placeholder="请输入目标 URL" />
      </el-form-item>

      <el-form-item label="项目状态">
        <el-select v-model="form.status" style="width: 100%;">
          <el-option label="进行中" value="active" />
          <el-option label="已暂停" value="paused" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </el-form-item>

      <el-form-item label="说明">
        <el-input v-model="form.description" type="textarea" :rows="5" placeholder="可填写目标、范围或执行说明" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="$emit('submit', form)">保存项目</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { normalizeStatus } from '../../utils/status';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
});

defineEmits(['submit']);

const form = reactive({
  name: '',
  target_url: '',
  status: 'active',
  description: ''
});

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(form, {
      name: value?.name || '',
      target_url: value?.target_url || '',
      status: normalizeStatus(value?.status || 'active'),
      description: value?.description || ''
    });
  },
  { immediate: true, deep: true }
);
</script>
