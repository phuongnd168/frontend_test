import { defineStore } from "pinia";
import axios from "axios";
const API_BASE_URL = "http://localhost:5097/api";

export const useCategoryStore = defineStore("category", {
    state: () => ({
    category: []
  }),
  actions: {
    async addCategory(body) {
      const { nameEn, nameVi } = body;
      const response = await axios.post(`${API_BASE_URL}/categories`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        nameEn,
        nameVi,
      });
      if (response.data.StatusCode === 201) {
        return true;
      }
      return false;
    },
    async deleteCategory(id) {
        const result = await axios.delete(`${API_BASE_URL}/categories/${id}`);
        if (result.data.StatusCode === 200) {
            return true
        }
        return false
    },
    async getCategory(id) {
      const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
      if (response.data.StatusCode === 200) {
        this.category = response.data.Data;
        return true;
      }
      return false;
    },
    async updateCategory(id, body) {
   
      const { nameEn, nameVi } = body;
   
      const response = await axios.put(`${API_BASE_URL}/categories/${id}`,{
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        nameEn,
        nameVi,
      });
      if (response.data.StatusCode === 200) {
        return true;
      }
      return false;
    },
    getDialogTitle(mode){
        return mode === "add" ? "Thêm danh mục" : "Sửa danh mục"
    }
  },
});
