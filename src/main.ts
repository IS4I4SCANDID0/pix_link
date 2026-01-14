import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueToast from 'vue-toast-notification'

import App from './App.vue'
import './styles/global.css'
import 'vue-toast-notification/dist/theme-sugar.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(VueToast, {
  position: 'top',
  duration: 3000,
  dismissible: true,
})

app.mount('#app')

// Expor Pinia para o Cypress conseguir testar o Rate Limit
if (import.meta.env.DEV || (typeof window !== 'undefined' && (window as any).Cypress)) {
  ;(window as any).__pinia = pinia
}

// Tratamento de erros simplificado apenas com log
app.config.errorHandler = (err, _instance, info) => {
  console.error('❌ Erro global:', err)
  console.debug('📍 Info:', info)
}
