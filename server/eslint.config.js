import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: "node_modules" },
  {
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
  },
]
