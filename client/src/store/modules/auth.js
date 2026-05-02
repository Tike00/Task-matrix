import { defineStore } from 'pinia';
import { loginApi, meApi, changePasswordApi } from '../../api/auth';
import { setToken, getToken, clearAuth, setUser, getUser } from '../../utils/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken(),
    user: getUser(),
    loading: false
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    async login(form) {
      this.loading = true;
      try {
        const res = await loginApi(form);
        this.token = res.data.token;
        this.user = res.data.user;
        setToken(this.token);
        setUser(this.user);
        return res.data;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      const res = await meApi();
      this.user = res.data;
      setUser(this.user);
      return res.data;
    },
    async changePassword(form) {
      const res = await changePasswordApi(form);
      return res.data;
    },
    logout() {
      this.token = '';
      this.user = null;
      clearAuth();
    }
  }
});