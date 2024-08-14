import js from '@eslint/js'
import jest from 'eslint-plugin-jest'
import prettier from 'eslint-plugin-prettier/recommended'
import ts from 'typescript-eslint'

export default [
  {
    ignores: ['coverage', 'dist', 'lib']
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...[jest.configs['flat/recommended']],
  ...[prettier],
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest'
      }
    }
  }
]
