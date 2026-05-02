<template>
  <el-tag :type="tagType">{{ label }}</el-tag>
</template>

<script setup>
import { computed } from 'vue';
import { getStatusLabel, normalizeStatus } from '../../utils/status';

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
});

const normalized = computed(() => normalizeStatus(props.text));
const label = computed(() => getStatusLabel(props.text));

const tagType = computed(() => {
  if (['active', 'running'].includes(normalized.value)) return 'warning';
  if (['completed'].includes(normalized.value)) return 'success';
  if (['failed'].includes(normalized.value)) return 'danger';
  if (['paused', 'stopped'].includes(normalized.value)) return 'info';
  return '';
});
</script>
