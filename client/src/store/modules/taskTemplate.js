import { defineStore } from 'pinia';
import {
  getTaskTemplatesApi,
  createTaskTemplateApi,
  updateTaskTemplateApi,
  deleteTaskTemplateApi
} from '../../api/taskTemplates';

export const useTaskTemplateStore = defineStore('taskTemplate', {
  state: () => ({
    list: [],
    loading: false
  }),
  actions: {
    async fetchTemplates() {
      this.loading = true;
      try {
        const res = await getTaskTemplatesApi();
        this.list = res.data || [];
        return this.list;
      } finally {
        this.loading = false;
      }
    },
    async createTemplate(payload) {
      const res = await createTaskTemplateApi(payload);
      return res.data;
    },
    async updateTemplate(id, payload) {
      const res = await updateTaskTemplateApi(id, payload);
      return res.data;
    },
    async deleteTemplate(id) {
      const res = await deleteTaskTemplateApi(id);
      return res.data;
    }
  }
});