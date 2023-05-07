import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
import loadCssModulePlugin from 'vite-plugin-load-css-module'
import reactCssModule from 'vite-plugin-react-css-modules'

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  const isDevelopment = configEnv.mode === 'development'
  const isProduction = configEnv.mode === 'production'
  const generateScopedName = isDevelopment
    ? '[name]__[local]__[hash:base64:5]'
    : '[hash:base64:5]'
  return {
    plugins: [
      vue(),
      vueJsx(),
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
      reactCssModule({
        generateScopedName,
        filetypes: {
          '.less': {
            syntax: 'postcss-less'
          }
        }
      }),
      loadCssModulePlugin({
        include: id => id.endsWith('less') && !id.includes('node_modules')
      }),
      // 生产环境才开启压缩
      isProduction && optimizeCssModules()
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      modules: {
        generateScopedName: isDevelopment
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:5]'
      }
    }
  }
})
