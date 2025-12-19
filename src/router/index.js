import { createRouter, createWebHistory } from 'vue-router'


import NotFound from '@/components/NotFound.vue'
import Header from '@/components/Header.vue'
import OrderInfo from '@/components/OrderInfo.vue'
import ManagerProducts from '@/components/ManagerProducts.vue'
import AddProduct from '../components/AddProduct.vue'
import UpdateProduct from '@/components/UpdateProduct.vue'
import ManagerCategories from '@/components/ManagerCategories.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import VNPay from '@/components/VNPay.vue'


const routes = [
  { path: '/', name: 'Home', component: Header ,   meta: { requiresAuth: true } },
  { path: '/order-info', name: 'OrderInfo', component: OrderInfo,   meta: { requiresAuth: true }  },
  { path: '/manager-products', name: 'ManagerProducts', component: ManagerProducts, meta: { requiresAuth: true } },
  { path: '/manager-products/add', name: 'AddProduct', component: AddProduct, meta: { requiresAuth: true } },
  { path: "/manager-products/update/:id", name: 'UpdateProduct', component: UpdateProduct, meta: { requiresAuth: true } },
  { path: "/manager-categories", name: 'ManagerCategories', component: ManagerCategories, meta: { requiresAuth: true } },
  { path: "/login", name: 'Login', component: Login },
  { path: "/register", name: 'Register', component: Register },
   { path: "/forgot-password", name: 'ForgotPassword', component: ForgotPassword },
      { path: "/vn-pay", name: 'VNPay', component: VNPay },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const tokenExpireAt = localStorage.getItem("tokenExpireAt");
  if (to.meta.requiresAuth && !token) {
    return next("/login");  
  }
  if(token && Date.now()>tokenExpireAt){
    return next("/login");  
  }
  next();
});
export default router
