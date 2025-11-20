import { createRouter, createWebHistory } from 'vue-router'


import NotFound from '@/components/NotFound.vue'
import Header from '@/components/Header.vue'
import OrderInfo from '@/components/OrderInfo.vue'
import Payment from '@/components/Payment.vue'

const routes = [
  { path: '/', name: 'Home', component: Header },
   { path: '/payment', name: 'Payment', component: Payment },
  { path: '/order-info', name: 'OrderInfo', component: OrderInfo },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
