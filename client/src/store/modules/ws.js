import { defineStore } from 'pinia';
import { getToken } from '../../utils/auth';
import { getWsUrl } from '../../utils/runtimeConfig';

export const useWsStore = defineStore('ws', {
  state: () => ({
    ws: null,
    connected: false,
    logs: [],
    taskStatuses: {},
    phaseEvents: []
  }),
  actions: {
    connect() {
      if (this.ws) return;

      const token = getToken();
      const base = getWsUrl();
      const ws = new WebSocket(`${base}?token=${token}`);

      ws.onopen = () => {
        this.connected = true;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'task_log') {
            this.logs.push(data);
          }

          if (data.type === 'task_status') {
            this.taskStatuses[data.taskId] = data.status;
          }

          if (data.type === 'phase_completed') {
            this.phaseEvents.push(data);
          }
        } catch (error) {
          console.error(error);
        }
      };

      ws.onclose = () => {
        this.connected = false;
        this.ws = null;
      };

      ws.onerror = () => {
        this.connected = false;
      };

      this.ws = ws;
    },
    disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      this.connected = false;
    },
    clearLogs() {
      this.logs = [];
    }
  }
});
