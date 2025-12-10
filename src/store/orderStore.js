import { defineStore } from "pinia";
const API_BASE_URL = "http://localhost:5097/api";
import axios from "axios";
export const useOrderStore = defineStore("order", {
  state: () => ({
    carts: JSON.parse(sessionStorage.getItem("carts")) ?? [],
  }),

  getters: {
    countInCart: (state) => state.carts.length,
    countInProduct: (state) => (productId) => state.carts.find((product) => product.id === productId)?.count,
    totalPrice: (state) =>
      state.carts.reduce((total, product) => total + product.price * product.count, 0),

  },

  actions: {
    addString(locale){
        return this.carts?.length > 1 && locale === "en" ? "s" : ""
    },
    addToCart(product) {
      const index = this.carts.findIndex((cart) => cart.id === product.id);
      if (index >= 0) {
        this.carts[index].count += 1;
      }
      this.save();
    },

    removeFromCart(product) {
      const index = this.carts.findIndex((cart) => cart.id === product.id);
      if (index >= 0 && this.carts[index].count > 1) {
        this.carts[index].count -= 1;
      }
      this.save();
    },

    deleteItem(product) {
      this.carts = this.carts.filter((cart) => cart.id !== product.id);
      this.save();
    },

    checkDisable(product) {
      const index = this.carts.findIndex((cart) => cart.id === product.id);
      if (index >= 0 && this.carts[index].count === 1) {
        return true;
      }
      return false;
    },
    checkQuantity(product) {
       return this.countInProduct(product.id) >= product.quantity;
    },
    save() {
      sessionStorage.setItem("carts", JSON.stringify(this.carts));
    },
    async addOrder(userId, products) {
      try {
        const response = await axios.post(`${API_BASE_URL}/orderProduct`,{
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
            userId,
            products
        })
    
       
        if (response.data.StatusCode === 201) {           
            return true
        }
        return false
      } catch (e) {
        console.error("Fetch error:", e);
      }
    },
    async updateQuantity(dataPatch) {
      try {
        const response = await axios.patch(`${API_BASE_URL}/products`, dataPatch, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        })
        if (response.data.StatusCode === 200) {
            return true
        }
        return false
      } catch (e) {
        console.error("Fetch error:", e);
      }
    },
    clear() {
      sessionStorage.removeItem("carts");
      this.carts = [];
    },
    sync() {
      this.carts = JSON.parse(sessionStorage.getItem("carts")) ?? [];
    },
  },
});
