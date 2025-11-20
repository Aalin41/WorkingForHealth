import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 使用相對路徑，增加 PWA 與部署的相容性
  build: {
    outDir: 'dist',
  }
})
