
// // vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test:{
    environment: 'jsdom',
    setupFiles:'/src/setupTests.js'
  },
  define: {
    'process.env': {},
    'global':'globalThis'
  },
  resolve:{
     alias: {
      buffer: 'buffer/',
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util/'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  }
});

