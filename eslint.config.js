// eslint.config.js
import eslint from '@eslint/js';
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },
  eslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  prettierConfig,
];