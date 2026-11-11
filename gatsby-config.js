const isDeployPreview = process.env.CONTEXT === 'deploy-preview';
const isProduction = process.env.CONTEXT === 'production';
const permalinkBase = isDeployPreview ? process.env.DEPLOY_PRIME_URL : 'https://storybook.js.org';

module.exports = {
  flags: {
    FAST_DEV: false,
  },
  pathPrefix: `/tutorials`,
  // Gatsby 5's default, stated so nobody has to know that it changed. Page slugs come from
  // createFilePath and already end with a slash.
  trailingSlash: 'always',
  siteMetadata: {
    title: 'Storybook Tutorials',
    description:
      'Learn how to build and test UI components with Storybook. Our in-depth frontend guides are created by Storybook maintainers and peer-reviewed by the open source community.',
    permalink: `${permalinkBase}/tutorials`,
    siteUrl: permalinkBase,
    githubUrl: 'https://github.com/chromaui/learnstorybook.com',
    contributeUrl: 'https://github.com/chromaui/learnstorybook.com/#contribute',
    storybookVersion: 10,
    tutorialStatus: {
      'intro-to-storybook': {
        react: {
          de: 5.3,
          en: 10,
          es: 8.3,
          fr: 8.3,
          it: 7.6,
          ja: 8.3,
          ko: 10,
          nl: 5.3,
          pt: 5.3,
          'zh-CN': 6.1,
          'zh-TW': 6.3,
          ar: 6.3,
        },
        'react-native': {
          en: 8.1,
          es: 5.3,
          pt: 7.6,
        },
        vue: {
          en: 10,
          es: 6.1,
          fr: 5.3,
          ja: 10,
          pt: 5.3,
          it: 7.6,
          'zh-CN': 8.1,
        },
        angular: {
          en: 10,
          ja: 6.3,
          es: 6.3,
          pt: 5.3,
        },
        svelte: {
          en: 10,
          es: 5.3,
        },
      },
      'visual-testing-handbook': {
        react: {
          en: 10,
          es: 9.0,
          ko: 9.0,
        },
      },
      'ui-testing-handbook': {
        react: {
          en: 8.3,
          ko: 6.5,
        },
      },
      'ai-ready-design-systems': {
        react: {
          en: 10,
        },
      },
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content/`,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          // Custom plugins live in /plugins. Code tabs run first so that the copy button and the
          // code title the next plugins add to a fence end up inside its tab.
          `gatsby-remark-code-tabs`,
          // Titles before buttons: a titled fence then renders as title bar, copy button, code,
          // and the button can sit in the title bar's row.
          `gatsby-remark-code-titles`,
          `gatsby-remark-code-buttons-with-diff-support`,
          `gatsby-remark-copy-linked-files`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              quality: 100,
              maxWidth: 800,
              linkImagesToOriginal: false,
            },
          },
          `gatsby-remark-prefix-links`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      // gatsby-plugin-sitemap 6 writes to the site root by default; keep the files where
      // Gatsby 4 put them so the deployed sitemap URLs do not move.
      options: { output: '/sitemap' },
    },
    ...(isProduction
      ? [
          {
            resolve: `gatsby-plugin-plausible`,
            options: {
              domain: 'storybook.js.org',
            },
          },
        ]
      : []),
    ...(process.env.GOOGLE_TAG_TRACKING_ID && !isDeployPreview
      ? [
          {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
              trackingIds: [process.env.GOOGLE_TAG_TRACKING_ID],
            },
          },
        ]
      : []),
  ],
};
