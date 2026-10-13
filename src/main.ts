import { createApp, createSSRApp } from 'vue';
import App from './App.vue';
import './styles/main.css';

// Production HTML is prerendered. The Vite development shell still mounts normally.
const app = document.querySelector('#app')?.hasChildNodes() ? createSSRApp(App) : createApp(App);
app.mount('#app');
