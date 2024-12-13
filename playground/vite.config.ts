import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
// import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_PUBLIC_PATH || '/',
    server: {
      port: 9120
    },
    plugins: [
      vue(),
      vitePluginForArco({
        style: 'css'
      }),
      chunkSplitPlugin({
        strategy: 'default',
        customSplitting: {
          tools: [/lodash/, /@microsoft/],
          'vue-family': [/^vue$/, /vue-router/, /pinia/, /pinia-plugin-persistedstate/],
          arco: [/@arco-design/],
          'v3ms-utils': [/packages\/utils/],
          'v3ms-icons': [/packages\/icons/]
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
