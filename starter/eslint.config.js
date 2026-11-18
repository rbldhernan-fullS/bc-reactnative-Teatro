const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactHooks = require('eslint-plugin-react-hooks');
const prettier = require('eslint-config-prettier');

/**
 * Configuración plana (flat config) de ESLint.
 *
 * Desde la Fase 3 todas las reglas de correctitud son `error`: el código ya
 * está limpio y no quedan avisos. Las excepciones (escritura en consola) están
 * acotadas al logger y al filtro web de desarrollo.
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
      // React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',

      // Buenas prácticas
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      // Los marcadores `// ===== SEMANA NN =====` parten imports del mismo módulo
      // a propósito (evidencia de rúbrica), pero solo cuando separan tipos de
      // valores; dos imports de valor del mismo módulo se unifican.
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'no-empty': 'error',
      'no-console': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
    },
  },
  {
    // Única capa autorizada a escribir en la consola: el logger centraliza la
    // salida y `devConsole.web.ts` es el filtro que la limpia en desarrollo.
    files: ['src/utils/logger.ts', 'src/platform/devConsole.web.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  prettier,
);
