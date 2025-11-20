import './assets/main.css'
import router from './router/index';
import { createApp } from 'vue'
import PrimeVue from "primevue/config"
import Aura from "@primevue/themes/aura"
import App from './App.vue'
import 'primeflex/primeflex.css' 
 
import i18n from './i18n'  
const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
    
})
app.use(router)     
app.use(i18n)
app.mount('#app')
