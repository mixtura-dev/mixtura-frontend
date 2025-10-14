import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { version } from './package.json'
import { defineConfig, loadEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import checker from 'vite-plugin-checker'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const ALIASES = {
  '@': resolve(__dirname, 'src'),
  '@components': resolve(__dirname, 'src/components'),
  '@stores': resolve(__dirname, 'src/stores'),
}

export default defineConfig(({ mode = 'development' }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      visualizer({
        gzipSize: true,
        template: 'treemap',
      }),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint .',
          useFlatConfig: true,
        },
      }),
    ],
    define: {
      //Also add type to '/env.d.ts'
      __APP_VERSION__: JSON.stringify(version),
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
            validation: ['vee-validate', 'zod'],
            ui: ['reka-ui', 'vue-sonner'],
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8080,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
    resolve: { alias: ALIASES },
  }
})
