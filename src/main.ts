import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueToast from 'vue-toast-notification'
import * as Sentry from '@sentry/vue'

import App from './App.vue'
import './styles/global.css'
import 'vue-toast-notification/dist/theme-sugar.css'

// ========== CRIAR PINIA PRIMEIRO ==========
const pinia = createPinia()

// ========== CONFIGURAR PLUGIN ANTES DE USAR ==========
// CRÍTICO: Isso DEVE vir antes de app.use(pinia)
pinia.use(piniaPluginPersistedstate)

// ========== CRIAR APP ==========
const app = createApp(App)

// ========== USAR PLUGINS NA ORDEM CORRETA ==========
app.use(pinia) // Pinia ANTES do Toast
app.use(VueToast, {
  position: 'top',
  duration: 3000,
  dismissible: true,
})

// ========== MONTAR APLICAÇÃO ==========
app.mount('#app')

// ========== EXPOR NO WINDOW PARA TESTES ==========
// Expõe tanto em DEV quanto quando Cypress está presente
if (import.meta.env.DEV || (typeof window !== 'undefined' && (window as any).Cypress)) {
  ;(window as any).__pinia = pinia

  if (import.meta.env.DEV && !(window as any).Cypress) {
    console.table(`
  
      🚀 Aplicação Iniciada                
                                        
      Modo: ${import.meta.env.MODE.toUpperCase().padEnd(30)}
      Pinia: ✅ Ativo                      
      Persist: ✅ Ativo                    
      Toast: ✅ Ativo                      
      Sentry: ${import.meta.env.PROD ? '✅ Ativo' : '❌ Desabilitado'}                    
  
    `)
  }
}

// ========== TRATAMENTO DE ERROS GLOBAL ==========
app.config.errorHandler = (err, instance, info) => {
  console.error('❌ Erro global capturado:', err)
  console.error('📍 Info:', info)

  if (import.meta.env.PROD) {
    Sentry.captureException(err, {
      contexts: {
        vue: {
          componentName: instance?.$options.name || 'Unknown',
          propsData: instance?.$props,
          errorInfo: info,
        },
      },
    })
  }
}

app.config.warnHandler = (msg, instance, trace) => {
  if (import.meta.env.DEV) {
    console.warn('⚠️ Vue Warning:', msg)
    console.warn('📍 Trace:', trace)
  }
}
