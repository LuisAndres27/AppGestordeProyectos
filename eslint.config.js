// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = {
  extends: ['expo', 'prettier'],
  Plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
