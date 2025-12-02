import { defineStore } from 'pinia';

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    message: ''
  }),
  actions: {
    setMessage(msg) {
      this.message = msg;
    }
  }
});