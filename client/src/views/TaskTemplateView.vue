<template>
  <AppLayout>
    <PageContainer title="任务模板" description="维护可拖入阶段的任务模板，统一命令格式与执行习惯。">
      <template #extra>
        <el-button type="primary" @click="openCreate">新建模板</el-button>
      </template>

      <el-table :data="taskTemplateStore.list" border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="description" label="说明" min-width="180" />
        <el-table-column prop="phase_name" label="阶段标签" width="140" />
        <el-table-column prop="command_template" label="命令模板" min-width="280" />
        <el-table-column prop="enabled_by_default" label="默认启用" width="100">
          <template #default="{ row }">
            {{ row.enabled_by_default ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="dialogVisible" :title="form.id ? '编辑模板' : '新建模板'" width="720px">
        <el-form :model="form" label-width="120px">
          <el-form-item label="模板名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="模板说明">
            <el-input v-model="form.description" />
          </el-form-item>
          <el-form-item label="阶段标签">
            <el-input v-model="form.phase_name" />
          </el-form-item>
          <el-form-item label="命令模板">
            <el-input v-model="form.command_template" />
          </el-form-item>
          <el-form-item label="默认启用">
            <el-switch v-model="form.enabled_by_default" />
          </el-form-item>
          <el-form-item label="排序号">
            <el-input-number v-model="form.sort_order" :min="0" />
          </el-form-item>
          <el-form-item label="启用">
            <el-switch v-model="form.is_active" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </template>
      </el-dialog>
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import { useTaskTemplateStore } from '../store/modules/taskTemplate';
import { showError, showSuccess } from '../utils/message';

const taskTemplateStore = useTaskTemplateStore();

const dialogVisible = ref(false);
const form = reactive({
  id: null,
  name: '',
  description: '',
  phase_name: '',
  command_template: '',
  enabled_by_default: true,
  sort_order: 0,
  is_active: true
});

onMounted(async () => {
  await taskTemplateStore.fetchTemplates();
});

function resetForm() {
  form.id = null;
  form.name = '';
  form.description = '';
  form.phase_name = '';
  form.command_template = '';
  form.enabled_by_default = true;
  form.sort_order = 0;
  form.is_active = true;
}

function openCreate() {
  resetForm();
  dialogVisible.value = true;
}

function openEdit(row) {
  form.id = row.id;
  form.name = row.name;
  form.description = row.description;
  form.phase_name = row.phase_name;
  form.command_template = row.command_template;
  form.enabled_by_default = !!row.enabled_by_default;
  form.sort_order = row.sort_order || 0;
  form.is_active = !!row.is_active;
  dialogVisible.value = true;
}

async function handleSave() {
  try {
    const payload = {
      name: form.name,
      description: form.description,
      phase_name: form.phase_name,
      command_template: form.command_template,
      enabled_by_default: form.enabled_by_default,
      sort_order: form.sort_order,
      is_active: form.is_active
    };

    if (form.id) {
      await taskTemplateStore.updateTemplate(form.id, payload);
      showSuccess('模板更新成功');
    } else {
      await taskTemplateStore.createTemplate(payload);
      showSuccess('模板创建成功');
    }

    dialogVisible.value = false;
    await taskTemplateStore.fetchTemplates();
  } catch (error) {
    showError(error.message);
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除模板「${row.name}」吗？`, '删除确认', {
      type: 'warning'
    });

    await taskTemplateStore.deleteTemplate(row.id);
    showSuccess('模板删除成功');
    await taskTemplateStore.fetchTemplates();
  } catch (error) {
    if (error !== 'cancel') {
      showError(error.message || '删除失败');
    }
  }
}
</script>
