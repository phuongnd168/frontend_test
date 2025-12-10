import { defineStore } from "pinia";
import axios from "axios";

const API_BASE_URL = "http://localhost:5097/api";

export const useProductStore = defineStore("products", {
  state: () => ({
    categories: [],
    products: [],
    productLength: 0
  }),

  actions: {
    async getProduct() {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/all`)
       
        if (response.data.StatusCode === 200) {
            this.products = response.data.Data;
            this.productLength = this.products.length
            return true
        }
        return false
      } catch (e) {
        console.error("Fetch error:", e);
      }
    },
    async getCategory() {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`)
        if (response.data.StatusCode === 200) {
            this.categories = response.data.Data;
            return true
        }
        return false
      } catch (e) {
        console.error("Fetch error:", e);
      }
    },

    filterByCategory(category) {
      if (category === "All") return this.products;
      return this.products.filter(product => product.CategoryId.some(x => x === category));
    },
    async deleteProduct(id) {
        const result = await axios.delete(`${API_BASE_URL}/products/${id}`);
        if (result.data.StatusCode === 200) {
            return true
        }
        return false
    },
     async getProductToFilters(pageSize, page, keyword, sortField, sortOrder) {
      let sortDirection = "asc"
      if(sortField){
        if(sortOrder===-1){
          sortDirection= "desc"
        }
         const response = await axios.get(`${API_BASE_URL}/products/?pageSize=${pageSize}&page=${page}&keyword=${keyword}&sortField=${sortField}&sortDirection=${sortDirection}`);
        if (response.data.StatusCode === 200) {
          const {products, totalCount} = response.data.Data
          this.products = products;
          this.productLength = totalCount
          return true;
        } 
        return false
      }
      if(keyword){
        const response = await axios.get(`${API_BASE_URL}/products/?pageSize=${pageSize}&page=${page}&keyword=${keyword}`);
        if (response.data.StatusCode === 200) {
          const {products, totalCount} = response.data.Data
          this.products = products;
          this.productLength = totalCount
          return true;
        } 
        return false
      }
        const response = await axios.get(`${API_BASE_URL}/products/?pageSize=${pageSize}&page=${page}`);
        if (response.data.StatusCode === 200) {
          const {products, totalCount} = response.data.Data
          this.products = products
          this.productLength = totalCount
        return true;
        }
      return false;
    },
 
     getCategoryName() {
       this.products.forEach((product) => {
      if (product.CategoryId && product.CategoryId.length > 0) {
        product.CategoriesSelected = this.categories.filter((c) =>
          product.CategoryId.some((pc) => pc === c.Id)
        );
      } else {
        product.CategoriesSelected = [];
      }
    });
    },
  }
});
