module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
  ],
  webpackFinal: async config => {
    // sets production mode to allow babel plugin remove graphql queries to work properly and prevent Gatsby data layer to trigger
    // and try to fetch something it shouldn't.
    process.env.NODE_ENV = 'production';
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];
    // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
    config.module.rules[0].use[0].loader = require.resolve('babel-loader');
    // use @babel/preset-react for JSX and env (instead of staged presets)
    config.module.rules[0].use[0].options.presets = [
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-env'),
    ];
    config.module.rules[0].use[0].options.plugins = [
      // use @babel/plugin-proposal-class-properties for class arrow functions
      require.resolve('@babel/plugin-proposal-class-properties'),
      // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
      [
        require.resolve('babel-plugin-remove-graphql-queries'),
        {
          stage: config.mode === `development` ? 'develop-html' : 'build-html',
          staticQueryDir: 'page-data/sq/d',
        },
      ],
    ];
    // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
    config.resolve.mainFields = ['browser', 'module', 'main'];

    return config;
  },
};
