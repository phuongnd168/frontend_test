import './assets/main.css'
import router from './router/index';
import { createApp } from 'vue'
import PrimeVue from "primevue/config"
import Aura from "@primevue/themes/aura"
import App from './App.vue'
import 'primeflex/primeflex.css' 
 import { createPinia } from 'pinia';
import i18n from './i18n' 
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
    
})
app.use(ConfirmationService); 
app.use(ToastService);
app.use(createPinia());
app.use(router)     
app.use(i18n)
app.mount('#app')
