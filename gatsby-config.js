const isDeployPreview = process.env.CONTEXT === 'deploy-preview';
const permalinkBase = isDeployPreview ? process.env.DEPLOY_PRIME_URL : 'https://storybook.js.org';

module.exports = {
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    FAST_DEV: true,
    QUERY_ON_DEMAND: true,
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
    storybookVersion: 6.2,
    tutorialStatus: {
      'intro-to-storybook': {
        react: {
          de: 5.3,
          en: 6.2,
          es: 5.3,
          fr: 6.1,
          ja: 6.1,
          ko: 6.1,
          nl: 5.3,
          pt: 5.3,
          'zh-CN': 6.1,
          'zh-TW': 5.3,
        },
        'react-native': {
          en: 5.3,
          es: 5.3,
        },
        vue: {
          en: 6.2,
          es: 6.1,
          fr: 5.3,
          pt: 5.3,
        },
        angular: {
          en: 6.2,
          ja: 6.2,
          es: 5.3,
          pt: 5.3,
        },
        svelte: {
          en: 6.2,
          es: 5.3,
        },
        ember: {
          en: 6.2,
        },
      },
      'design-systems-for-developers': {
        react: {
          en: 6.2,
          ko: 6.1,
          pt: 5.3,
        },
      },
      'visual-testing-handbook': {
        react: {
          en: 6.2,
          es: 6.2,
        },
      },
      'create-an-addon': {
        react: {
          en: 6.2,
          fr: 6.2,
        },
      },
    },
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve(`./src/components/composite/AppLayout.js`),
      },
    },
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
    `gatsby-plugin-styled-components`,
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
    ...(process.env.FACEBOOK_PIXEL_ID && !isDeployPreview
      ? [
          {
            resolve: 'gatsby-plugin-facebook-pixel',
            options: {
              pixelId: process.env.FACEBOOK_PIXEL_ID,
            },
          },
        ]
      : []),
  ],
};
