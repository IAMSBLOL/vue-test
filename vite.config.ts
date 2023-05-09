import { fileURLToPath, URL } from 'node:url'

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
import basicSsl from '@vitejs/plugin-basic-ssl'
import babel from 'vite-plugin-babel'
import { extname } from 'path'
// import vitePluginCssModules from '@zebing/vite-plugin-css-modules'
// import path from 'path'
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
      vueJsx(
        {
          babelPlugins: [
            [
              '@zebing/babel-plugin-vue-css-modules',
              {
                styleName: 'styleName',
                exclude: /node_modules/
              }
            ]
          ]
        }
      ),
      basicSsl(),
      babel({
        filter: /\.tsx?$/,
        loader: (path:any):any => {
          if (extname(path) === '.jsx') {
            return 'jsx'
          }
        }
      }),
      // vitePluginCssModules({ styleName: 'styleName', cssFile: ['less'] }),
      isProduction && legacy({
        targets: ['defaults', 'not IE 11']
      }),

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
