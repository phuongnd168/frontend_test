import { createRouter, createWebHistory } from 'vue-router'


import NotFound from '@/components/NotFound.vue'
import Header from '@/components/Header.vue'
import OrderInfo from '@/components/OrderInfo.vue'

import OrderComplete from '@/components/OrderComplete.vue'
import ManagerProducts from '@/components/ManagerProducts.vue'
import AddProduct from '../components/AddProduct.vue'
import UpdateProduct from '@/components/UpdateProduct.vue'

const routes = [
  { path: '/', name: 'Home', component: Header },
   { path: '/order-complete', name: 'OrderComplete', component: OrderComplete },
  { path: '/order-info', name: 'OrderInfo', component: OrderInfo },
     { path: '/manager-products', name: 'ManagerProducts', component: ManagerProducts },
      { path: '/manager-products/add', name: 'AddProduct', component: AddProduct },
           { path: "/manager-products/update/:id", name: 'UpdateProduct', component: UpdateProduct },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
