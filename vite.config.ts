import { fileURLToPath, URL } from 'node:url'

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
// import loadCssModulePlugin from 'vite-plugin-load-css-module'
import basicSsl from '@vitejs/plugin-basic-ssl'
import babel from 'vite-plugin-babel'

import path from 'path'
// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  const isDevelopment = configEnv.mode === 'development'
  const isProduction = configEnv.mode === 'production'
  const generateScopedName = isDevelopment
    ? '[name]__[hash:base64:5]'
    : '[hash:base64:5]'
  return {
    plugins: [
      vue(),
      vueJsx(),
      basicSsl(),
      babel({
        babelConfig: {
          configFile: path.resolve(__dirname, 'babel.config.js')
        }
      }),
      isProduction && legacy({
        targets: ['defaults', 'not IE 11']
      }),

      // loadCssModulePlugin({
      //   include: id => id.endsWith('less') && !id.includes('node_modules')
      // }),
      isProduction && splitVendorChunkPlugin(),
      // 生产环境才开启压缩
      isProduction && optimizeCssModules()

    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@src': fileURLToPath(new URL('./src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        '@router': fileURLToPath(new URL('./src/router', import.meta.url)),
        '@api': fileURLToPath(new URL('./src/axios', import.meta.url))
      }
    },
    css: {
      modules: {
        generateScopedName
      }
    },
    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048
    }
  }
})
