import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate); // save store to localStorage

const app = createApp(App)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is considered stale after 5 minutes
      gcTime: 10 * 60 * 1000, // Cache data for 10 minutes
      retry: 2, // Retry failed requests 2 times
      refetchOnWindowFocus: false, // Refetch on window focus
      refetchOnReconnect: true, // Refetch on reconnect
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
})
app.use(router)
app.use(pinia)
app.use(VueQueryPlugin, {
  queryClient,
})
app.mount('#app')
