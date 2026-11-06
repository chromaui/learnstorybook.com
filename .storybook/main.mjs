/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    // The Babel plugins Gatsby components need live in the Vite config so the framework
    // reuses that react plugin instead of adding a second JSX transform.
    options: { builder: { viteConfigPath: '.storybook/vite.config.mjs' } },
  },
  staticDirs: ['../static'],
};

export default config;
