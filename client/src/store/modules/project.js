import { defineStore } from 'pinia';
import {
  getProjectsApi,
  createProjectApi,
  getProjectDetailApi,
  updateProjectApi,
  deleteProjectApi
} from '../../api/projects';

export const useProjectStore = defineStore('project', {
  state: () => ({
    list: [],
    detail: null,
    loading: false
  }),
  actions: {
    async fetchProjects() {
      this.loading = true;
      try {
        const res = await getProjectsApi();
        this.list = res.data || [];
        return this.list;
      } finally {
        this.loading = false;
      }
    },
    async createProject(payload) {
      const res = await createProjectApi(payload);
      return res.data;
    },
    async fetchProjectDetail(id) {
      const res = await getProjectDetailApi(id);
      this.detail = res.data;
      return res.data;
    },
    async updateProject(id, payload) {
      const res = await updateProjectApi(id, payload);
      return res.data;
    },
    async deleteProject(id) {
      const res = await deleteProjectApi(id);
      return res.data;
    }
  }
});