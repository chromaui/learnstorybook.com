import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';

/**
 * eslint-plugin-react 7.37 still calls context methods that ESLint 10 removed; fixupPluginRules
 * restores them for its rules until the plugin ships an ESLint 10 release.
 */
const reactPlugin = fixupPluginRules(react);

export default [
  {
    ignores: [
      '.cache',
      'public',
      'storybook-static',
      'node_modules',
      '.yarn',
      'src/content/docs',
      'src/html.js',
      '.superpowers/**',
    ],
  },
  js.configs.recommended,
  { ...react.configs.flat.recommended, plugins: { react: reactPlugin } },
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  importPlugin.flatConfigs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      // Gatsby config, plugins and scripts run under Node; app code reads process.env via webpack.
      globals: { ...globals.browser, ...globals.node, graphql: 'readonly' },
    },
    settings: {
      react: { version: 'detect' },
      // The default node resolver cannot read package exports maps (storybook/test, vite, ...);
      // the typescript resolver can and needs no TypeScript to resolve plain JavaScript.
      'import/resolver': { typescript: { alwaysTryTypes: false } },
    },
    rules: {
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true, caughtErrors: 'none' },
      ],
      // Computed access into `import * as animations` is deliberate in GuideScreen/Hero.
      'import/namespace': ['error', { allowComputed: true }],
      // Client-only state (sessionStorage, fetch) must be set in effects so server and client
      // render the same initial markup; the compiler-era rule flags that pattern.
      'react-hooks/set-state-in-effect': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          // The local Gatsby plugins carry stub manifests; the root package.json is what installs
          // their dependencies, so check against it everywhere.
          packageDir: import.meta.dirname,
          devDependencies: [
            '**/*.stories.js',
            '**/*.test.js',
            '.storybook/**',
            'eslint.config.mjs',
          ],
        },
      ],
      'jsx-a11y/anchor-is-valid': ['error', { components: ['GatsbyLink'], specialLink: ['to'] }],
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    },
  },
  {
    /**
     * This file is pulled from frontpage and contains imports that don't exist in this project.
     * It still builds, though, so we're disabling these rules for this file.
     */
    files: ['site-metadata.js'],
    rules: { 'import/extensions': 'off', 'import/no-unresolved': 'off' },
  },
  {
    /**
     * Helpers and their tests also run under Node's ESM loader, which requires explicit file
     * extensions on relative imports.
     */
    files: ['**/*.test.js', 'src/lib/*.js', 'src/utils/*.js'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'import/extensions': 'off' },
  },
  prettier,
];
