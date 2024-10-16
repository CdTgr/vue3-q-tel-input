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
