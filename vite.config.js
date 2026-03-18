import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_BASE_URL || 'http://umkm-platform.my.id/api'
  // Ambil base URL tanpa /api untuk proxy target
  const proxyTarget = apiUrl.replace(/\/api$/, '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path, // keep /api prefix
        },
      },
    },
    resolve: {
      alias: { '@': '/src' },
    },
  }
})
