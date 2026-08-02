import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Serves the API under the dev server origin, so the browser only ever
    // sees one origin and no CORS handling is needed on either side.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
