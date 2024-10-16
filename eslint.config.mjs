// import js from '@eslint/js'
// import vueEssential from 'eslint-plugin-vue'
// // import prettierRecommended from 'eslint-plugin-prettier'
// import vueParser from 'vue-eslint-parser'
// import typeScriptParser from '@typescript-eslint/parser'
// import prettierPlugin from 'eslint-plugin-prettier'
// import typeScriptPlugin from '@typescript-eslint/eslint-plugin'

// const eslintPluginPrettier = {
//   configs: {
//     recommended: {
//       extends: ['prettier'],
//       plugins: ['prettier'],
//       rules: {
//         'prettier/prettier': 'error',
//         'arrow-body-style': 'off',
//         'prefer-arrow-callback': 'off',
//       },
//     },
//   },
// }

// export default [
//   {
//     ignores: ['node_modules', 'dist'],
//   },
//   {
//     files: ['**/*.ts', '**/*.vue'],
//     // languageOptions: {
//     //   parser: vueParser,
//     //   parserOptions: {
//     //     parser: typeScriptParser,
//     //   },
//     // },
//     // plugins: {
//     //   '@typescript-eslint': typeScriptPlugin,
//     //   prettier: prettierPlugin,
//     // },
//     rules: {
//       // 'prettier/prettier': 'error',
//       // 'vue/no-multiple-template-root': 'off',
//       // '@typescript-eslint/ban-types': [
//       //   'error',
//       //   {
//       //     extendDefaults: true,
//       //     types: {
//       //       '{}': false,
//       //     },
//       //   },
//       // ],
//     },
//   },
//   js.configs.recommended,
//   vueEssential.configs['vue3-essential'],
//   // vueTypeScript,
//   // prettierRecommended.configs,
// ]

import js from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'

export default ts.config(
  {
    ignores: ['node_modules', 'dist'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: ['**/*.ts', '*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      'vue/require-explicit-emits': 'off',
      'vue/multi-word-component-names': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-empty-object-type': 'off',
      'vue/max-attributes-per-line': 'off',
    },
  },
)
