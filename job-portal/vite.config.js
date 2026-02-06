// // vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// export default defineConfig({
//   plugins: [react()],
//   define: {
//     'process.env': {},
//     global: 'globalThis',
//   },
//   resolve: {
//     alias: {
//       stream: path.resolve(__dirname, 'node_modules/stream-browserify/index.js'),
//       util: path.resolve(__dirname, 'node_modules/util/util.js'),
//       buffer: path.resolve(__dirname, 'node_modules/buffer/index.js'),
//       process: path.resolve(__dirname, 'node_modules/process/browser.js'),
//     }
//   },
//   optimizeDeps: {
//     include: ['buffer', 'process', 'stream-browserify', 'util'],
//     exclude: ['@nestjs/graphql', '@nestjs/common', '@nestjs/core'],
//     esbuildOptions: {
//       define: {
//         global: 'globalThis'
//       }
//     }
//   }
// })




// // vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   define: {
//     'process.env': {},
//     global: 'globalThis',
//   },
//   resolve: {
//     alias: {
//       stream: 'stream-browserify',
//       buffer: 'buffer',
//       process: 'process/browser',
//       util: 'util',
//       http: 'stream-http',
//       https: 'https-browserify',
//       zlib: 'browserify-zlib',
//     }
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       define: {
//         global: 'globalThis'
//       }
//     }
//   }
// })


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global':'globalThis'
  },
  resolve:{
     alias: {
      // Add these if you encounter more Node.js module errors
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

