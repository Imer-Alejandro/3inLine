import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Vue3Toasity from 'vue3-toastify';
import io from 'socket.io-client';

const app = createApp(App)

app.use(Vue3Toasity,{limit: 2,})

const socket = io(`${import.meta.env.VITE_API_SERVER}`);

app.config.globalProperties.$socket = socket;




app.mount('#app')
