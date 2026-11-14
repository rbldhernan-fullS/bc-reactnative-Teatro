const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactHooks = require('eslint-plugin-react-hooks');
const prettier = require('eslint-config-prettier');

/**
 * Configuración plana (flat config) de ESLint.
 *
 * Criterio de la Fase 1: la configuración entra sin cambiar lógica de la app.
 * Por eso las reglas que dependen del código heredado (`any`, `console`, `catch`
 * vacíos, `exhaustive-deps`) quedan en `warn` y se promueven a `error` cuando
 * el código se corrija en la Fase 3.
 */
module.exports = tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'web-build/**',
      '.expo/**',
      'android/**',
      'ios/**',
      'babel.config.js',
      'eslint.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // React: correctitud obligatoria, deuda pendiente como aviso
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',

      // Buenas prácticas
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      // Los marcadores `// ===== SEMANA NN =====` parten imports del mismo módulo
      // a propósito (evidencia de rúbrica). Se avisa, no se rompe la progresión.
      'no-duplicate-imports': 'warn',
      'no-empty': 'warn',
      'no-console': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
  prettier,
);
