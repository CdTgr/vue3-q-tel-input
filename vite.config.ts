import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),

    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      sassVariables: 'src/styles/quasar-variables.scss',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/entry.ts'),
      name: 'vue3-q-tel-input',
      fileName: 'index',
    },
    sourcemap: true,
    rollupOptions: {
      onwarn: (warning, warn) => {
        // There is a [bug](https://github.com/vuejs/babel-plugin-jsx/issues/697)
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
          return
        }

        warn(warning)
      },
      external: ['vue', 'quasar'],
      strictDeprecations: true,
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          quasar: 'Quasar',
        },
      },
    },
  },
})
