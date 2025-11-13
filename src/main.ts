import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const app = createApp(App)

app.use(VueToast, {
  position: 'top-right',
  duration: 3000,
  type: 'default',
  dismissible: true,
  pauseOnHover: true,
})

app.mount('#app')
