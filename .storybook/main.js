const webpack = require('webpack');

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-links'],
  core: {
    builder: 'webpack5',
  },
  env: (config) => ({
    ...config,
    GATSBY_ALGOLIA_API_KEY: process.env.GATSBY_ALGOLIA_API_KEY || 'GATSBY_ALGOLIA_API_KEY',
  }),
  webpackFinal: async (config) => {
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];

    config.externals = ['react-dom/client'];

    // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
    config.module.rules[0].use[0].options.plugins.push([
      require.resolve('babel-plugin-remove-graphql-queries'),
      {
        stage: 'develop-html',
        staticQueryDir: 'page-data/sq/d',
      },
    ]);

    return config;
  },
};
