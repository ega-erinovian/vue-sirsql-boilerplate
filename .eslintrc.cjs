module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'prettier'],
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
  rules: {}
};
