module.exports = {
  presets: [
    [
      'babel-preset-gatsby',
      {
        targets: {
          browsers: ['>0.25%', 'not dead'],
        },
      },
    ],
  ],
  plugins: [
    [
      '@emotion',
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
  ],
};
