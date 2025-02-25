import eslint from '@eslint/js'
import pluginJest from 'eslint-plugin-jest'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['coverage', 'dist', 'lib']
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {jest: pluginJest},
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest'
      }
    }
  }
)
