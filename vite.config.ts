import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 確保相對路徑正確，利於部署
  build: {
    outDir: 'dist',
  }
})