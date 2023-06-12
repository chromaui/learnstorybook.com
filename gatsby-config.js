const isDeployPreview = process.env.CONTEXT === 'deploy-preview';
const permalinkBase = isDeployPreview ? process.env.DEPLOY_PRIME_URL : 'https://storybook.js.org';

module.exports = {
  flags: {
    FAST_DEV: true,
  },
  pathPrefix: `/tutorials`,
  siteMetadata: {
    title: 'Storybook Tutorials',
    description:
      'Learn how to develop UIs with components and design systems. Our in-depth frontend guides are created by Storybook maintainers and peer-reviewed by the open source community.',
    permalink: `${permalinkBase}/tutorials`,
    siteUrl: permalinkBase,
    githubUrl: 'https://github.com/chromaui/learnstorybook.com',
    contributeUrl: 'https://github.com/chromaui/learnstorybook.com/#contribute',
    storybookVersion: 7.0,
    tutorialStatus: {
      'intro-to-storybook': {
        react: {
          de: 5.3,
          en: 7.0,
          es: 6.5,
          fr: 6.5,
          ja: 6.5,
          ko: 6.4,
          nl: 5.3,
          pt: 5.3,
          'zh-CN': 6.1,
          'zh-TW': 6.3,
          ar: 6.3,
        },
        'react-native': {
          en: 6.5,
          es: 5.3,
        },
        vue: {
          en: 7.0,
          es: 6.1,
          fr: 5.3,
          pt: 5.3,
          'zh-CN': 6.5,
        },
        angular: {
          en: 7.0,
          ja: 6.3,
          es: 6.3,
          pt: 5.3,
        },
        svelte: {
          en: 6.5,
          es: 5.3,
        },
        ember: {
          en: 6.3,
        },
      },
      'design-systems-for-developers': {
        react: {
          en: 6.5,
          ko: 6.4,
          pt: 5.3,
          'zh-CN': 6.3,
          ja: 6.4,
        },
      },
      'visual-testing-handbook': {
        react: {
          en: 7.0,
          es: 6.5,
          ko: 6.5,
        },
      },
      'create-an-addon': {
        react: {
          en: 6.5,
          fr: 6.5,
          es: 6.5,
          ko: 6.5,
        },
      },
      'ui-testing-handbook': {
        react: {
          en: 7.0,
          ko: 6.5,
        },
      },
    },
  },
  plugins: [
    'gatsby-plugin-react-helmet',
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
          `gatsby-remark-code-titles`,
          // A custom plugin in /plugins directory
          `gatsby-remark-prefix-links`,
        ],
      },
    },
    `gatsby-plugin-sitemap`,
    ...(process.env.GOOGLE_ANALYTICS_TRACKING_ID && !isDeployPreview
      ? [
          {
            resolve: 'gatsby-plugin-google-analytics',
            options: {
              trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
              head: true,
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
