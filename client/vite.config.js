import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./",
  outputDir: "../dist",
  publicDir: "public",
  
  server: {
    cors: {
      origin: "http://localhost:5174"
    }
  }
})
