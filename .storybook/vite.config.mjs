import { fileURLToPath } from 'node:url';
import { transformAsync } from '@babel/core';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

// @vitejs/plugin-react 6 transpiles with oxc alone: it rejects JSX in .js files and cannot run
// Babel plugins. This pre-transform runs the project's own .js sources through Babel first, with
// the classic JSX runtime the site uses, the Emotion transform, and the Gatsby static-query
// rewrite that inlines the results of the `gatsby build` run by storybook:prepare.
function babelSources() {
  return {
    name: 'learnstorybook:babel-sources',
    enforce: 'pre',
    async transform(code, id) {
      const [file] = id.split('?');
      if (
        !file.startsWith(projectRoot) ||
        file.includes('/node_modules/') ||
        !file.endsWith('.js')
      ) {
        return null;
      }
      const result = await transformAsync(code, {
        filename: file,
        // Gatsby's own Babel preset targets browsers and injects core-js; keep it out of Vite.
        babelrc: false,
        configFile: false,
        sourceMaps: true,
        presets: [['@babel/preset-react', { runtime: 'classic' }]],
        plugins: [
          [
            '@emotion/babel-plugin',
            {
              importMap: {
                '@storybook/theming': {
                  styled: { canonicalImport: ['@emotion/styled', 'default'] },
                  css: { canonicalImport: ['@emotion/react', 'css'] },
                  Global: { canonicalImport: ['@emotion/react', 'Global'] },
                },
              },
            },
          ],
          [
            'babel-plugin-remove-graphql-queries',
            { stage: 'develop-html', staticQueryDir: 'page-data/sq/d' },
          ],
        ],
      });
      return { code: result.code, map: result.map };
    },
  };
}

export default defineConfig({
  plugins: [babelSources(), react({ jsxRuntime: 'classic' })],
  // Vite's default publicDir is public/, which holds the Gatsby build; copying it into
  // storybook-static would ship the whole site. Static assets come from staticDirs instead.
  publicDir: false,
  // The Algolia search key the site reads from process.env at build time. The Storybook `env`
  // option only feeds the webpack builder, so Vite gets it as a static define here.
  define: {
    'process.env.GATSBY_ALGOLIA_API_KEY': JSON.stringify(
      process.env.GATSBY_ALGOLIA_API_KEY || 'GATSBY_ALGOLIA_API_KEY'
    ),
  },
  optimizeDeps: {
    // The dependency scanner parses the story entries without running plugins, so it has to
    // accept JSX in .js files itself.
    rolldownOptions: { moduleTypes: { '.js': 'jsx' } },
  },
  resolve: {
    alias: [
      {
        find: /^gatsby$/,
        replacement: fileURLToPath(new URL('./gatsby-mock.js', import.meta.url)),
      },
    ],
  },
});
