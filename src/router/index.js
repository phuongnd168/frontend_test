import { createRouter, createWebHistory } from 'vue-router'


import NotFound from '@/components/NotFound.vue'
import Header from '@/components/Header.vue'
import OrderInfo from '@/components/OrderInfo.vue'
import ManagerProducts from '@/components/ManagerProducts.vue'
import AddProduct from '../components/AddProduct.vue'
import UpdateProduct from '@/components/UpdateProduct.vue'
import ManagerCategories from '@/components/ManagerCategories.vue'

const routes = [
  { path: '/', name: 'Home', component: Header },
  { path: '/order-info', name: 'OrderInfo', component: OrderInfo },
  { path: '/manager-products', name: 'ManagerProducts', component: ManagerProducts },
  { path: '/manager-products/add', name: 'AddProduct', component: AddProduct },
  { path: "/manager-products/update/:id", name: 'UpdateProduct', component: UpdateProduct },
  { path: "/manager-categories", name: 'ManagerCategories', component: ManagerCategories },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
