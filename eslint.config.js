// eslint.config.js
const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const prettierPlugin = require('eslint-plugin-prettier');
const detoxPlugin = require('eslint-plugin-detox');
const jestPlugin = require('eslint-plugin-jest');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  // Use ESLint's recommended rules as a base
  js.configs.recommended,

  // React plugin configuration
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier plugin configuration
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          quoteProps: 'consistent',
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          useTabs: false,
        },
      ],
    },
  },

  // Detox and Jest plugin configuration
  {
    plugins: {
      detox: detoxPlugin,
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...jestPlugin.configs.recommended.globals,
        module: true,
        require: true,
        console: true,
        __dirname: true,
        by: true,
        describe: true,
        it: true,
        beforeAll: true,
        afterAll: true,
      },
    },
  },

  // Custom rules
  {
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-undef': 'off', // Turn off no-undef as TypeScript handles this
      '@typescript-eslint/no-explicit-any': 'off', // Allow any type
      '@typescript-eslint/no-unused-vars': 'off', // Turn off unused vars completely
      '@typescript-eslint/no-unused-expressions': 'off', // Allow unused expressions
      'react/display-name': 'off', // Allow components without display names
    },
  },

  // Files to ignore (replacing .eslintignore)
  {
    ignores: ['node_modules/**', 'lib/**', 'example/dist/**'],
  },

  // Apply to all JavaScript files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // TypeScript files specific configuration
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      // Override TypeScript ESLint recommended rules
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];
