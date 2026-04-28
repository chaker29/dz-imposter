import { defineConfig } from 'vite' // <--- THIS LINE IS MISSING!
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, 
    allowedHosts: true
  }
})