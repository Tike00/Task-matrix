import { defineStore } from 'pinia';
import {
  getPhasesByProjectApi,
  createPhaseApi,
  reorderPhasesApi,
  getPhaseDetailApi,
  updatePhaseApi,
  deletePhaseApi,
  executePhaseApi
} from '../../api/phases';
import {
  getProjectTasksApi,
  createProjectTaskApi,
  reorderProjectTasksApi,
  moveProjectTaskApi,
  executeTaskApi,
  stopTaskApi,
  getTaskLatestResultApi
} from '../../api/tasks';

export const usePhaseStore = defineStore('phase', {
  state: () => ({
    phases: [],
    tasks: [],
    phaseDetail: null,
    activeTaskResult: null,
    loading: false
  }),
  actions: {
    async fetchPhases(projectId) {
      const res = await getPhasesByProjectApi(projectId);
      this.phases = res.data || [];
      return this.phases;
    },
    async createPhase(projectId, payload) {
      const res = await createPhaseApi(projectId, payload);
      return res.data;
    },
    async reorderPhases(projectId, items) {
      const res = await reorderPhasesApi(projectId, items);
      this.phases = res.data || [];
      return this.phases;
    },
    async fetchTasks(projectId) {
      const res = await getProjectTasksApi(projectId);
      this.tasks = res.data || [];
      return this.tasks;
    },
    async createTask(projectId, payload) {
      const res = await createProjectTaskApi(projectId, payload);
      return res.data;
    },
    async reorderTasks(projectId, items) {
      const res = await reorderProjectTasksApi(projectId, items);
      this.tasks = res.data || [];
      return this.tasks;
    },
    async moveTask(id, payload) {
      const res = await moveProjectTaskApi(id, payload);
      return res.data;
    },
    async updatePhase(id, payload) {
      const res = await updatePhaseApi(id, payload);
      return res.data;
    },
    async deletePhase(id) {
      const res = await deletePhaseApi(id);
      return res.data;
    },
    async executePhase(id) {
      const res = await executePhaseApi(id);
      return res.data;
    },
    async getPhaseDetail(id) {
      const res = await getPhaseDetailApi(id);
      this.phaseDetail = res.data;

      if (this.phaseDetail?.phase) {
        const index = this.phases.findIndex((item) => item.id === this.phaseDetail.phase.id);
        if (index !== -1) {
          this.phases[index] = {
            ...this.phases[index],
            ...this.phaseDetail.phase
          };
        }
      }

      return res.data;
    },
    async executeTask(id) {
      const res = await executeTaskApi(id);
      return res.data;
    },
    async stopTask(id) {
      const res = await stopTaskApi(id);
      return res.data;
    },
    async getTaskLatestResult(id) {
      const res = await getTaskLatestResultApi(id);
      this.activeTaskResult = res.data;
      return res.data;
    }
  }
});