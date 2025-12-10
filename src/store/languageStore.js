import { defineStore } from "pinia";

export const useLanguageStore = defineStore("language", {
  state: () => ({
    language: localStorage.getItem("language"),
  }),

  actions: { 
    toggle() {
      this.language = this.language === "vi" ? "en" : "vi";
      localStorage.setItem("language", this.language);
    },
  },
});
