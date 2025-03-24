const js = require('@eslint/js');
const globals = require('globals');

module.exports = {
  ignores: ["node_modules" ],
  files: ['**/*.{js}'],
  
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
  },
  
  rules: { ...js.configs.recommended.rules },
};