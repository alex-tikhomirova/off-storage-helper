import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
/*  base: "/store",*/
  server: {
    host: '0.0.0.0',
    port: 5120,
    watch: {
      usePolling: true
    },
    proxy: {
      "/publicapi": {
        target: "http://offgroup.xyz",
        changeOrigin: true,
      },
    },
  }
})
