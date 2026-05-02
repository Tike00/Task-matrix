<template>
  <div class="page-container">
    <section v-if="title || $slots.extra" class="page-header">
      <div class="page-copy">
        <div class="page-title">{{ title }}</div>
        <div v-if="description" class="page-desc">{{ description }}</div>
      </div>
      <div v-if="$slots.extra" class="page-extra">
        <slot name="extra" />
      </div>
    </section>

    <section class="page-body">
      <slot />
    </section>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 4px;
}

.page-title {
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.page-desc {
  margin-top: 8px;
  max-width: 780px;
  color: var(--text-soft);
  line-height: 1.6;
}

.page-extra {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.page-body {
  min-height: 120px;
}

@media (max-width: 960px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
