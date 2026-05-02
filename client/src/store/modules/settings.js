import { defineStore } from 'pinia';
import { getSettingsApi, updateSettingsApi } from '../../api/settings';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    list: [],
    loading: false
  }),
  actions: {
    async fetchSettings() {
      const res = await getSettingsApi();
      this.list = res.data || [];
      return this.list;
    },
    async updateSettings(payload) {
      const res = await updateSettingsApi(payload);
      this.list = res.data || [];
      return this.list;
    }
  }
});