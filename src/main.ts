import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'


// Import global CSS
import './assets/css/main.css'

// Plugins
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import i18n from './i18n/index'

// Import Floating Vue (Fixes "Failed to resolve directive: tooltip")
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

// 1. Create App
const app = createApp(App)

// 2. Install Pinia
const pinia = createPinia()
app.use(pinia)

// 3. Install Router
app.use(router)

// 4. Install I18n
app.use(i18n)

// 5. Install Floating Vue
app.use(FloatingVue)

// 6. Install Toast
app.use(Toast, {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    hideProgressBar: true,
});

// 7. Initialize Theme
import { useThemeStore } from './store/theme';
try {
    const themeStore = useThemeStore();
    themeStore.initTheme();
} catch (e) {
    console.warn("Theme init failed:", e);
}

// 8. Mount
app.mount('#app')
