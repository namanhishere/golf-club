import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Allows any host (useful for ngrok/tunneling)
    allowedHosts: true, 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Maps '@' to your 'src' folder
    },
  },
})