import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    tokenExpireAt: null
  }),

  actions: {
    setToken(token) {
      this.token = token;
      this.tokenExpireAt = Date.now() + 7200 * 1000;

      localStorage.setItem("token", token);
      
      localStorage.setItem("tokenExpireAt", this.tokenExpireAt);
      
    },

    logout() {
      this.token = null;
      this.tokenExpireAt = null
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpireAt");
    }
  }
});
