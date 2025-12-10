import { defineStore } from "pinia";

export const useCartStore = defineStore("carts", {
  state: () => ({
    carts: JSON.parse(sessionStorage.getItem("carts")) ?? [],
  }),

  getters: {
    totalQuantity: (state) =>
      state.carts.reduce((total, product) => total + product.count, 0),

    getCount: (state) => (productId) => {
      return state.carts.find((product) => product.id === productId)?.count
    },

    isAdded: (state) => (productId) => {
       return state.carts.some((cart) => cart.id === productId);
    },

    isMax: (state) => (product) => {
      return state.carts.find((cart) => cart.id === product.Id)?.count >= product.Quantity;
    },
  },

  actions: {
    add(product) {
      const index = this.carts.findIndex((cart) => cart.id === product.Id);
      if (index >= 0) {
        this.carts[index].count++;
      } else {
        this.carts.push({
          id: product.Id,
          nameVi: product.NameVi,
          nameEn: product.NameEn,
          img: product.Img,
          price: product.Price,
          quantity: product.Quantity,
          count: 1,
        });
      }

      this.save();
    },

    remove(product) {
      const index = this.carts.findIndex((cart) => cart.id === product.Id);
      if (index >= 0) {
      if (this.carts[index].count === 1) {
        this.carts.splice(index, 1);
       
      }else{
      this.carts[index].count -= 1;
      }

    }

      this.save();
    },

    save() {
      sessionStorage.setItem("carts", JSON.stringify(this.carts));
    },
    sync() {
      this.carts = JSON.parse(sessionStorage.getItem("carts")) ?? [];
    },
  },
});
