const isDeployPreview = process.env.CONTEXT === 'deploy-preview';
const permalink = isDeployPreview ? process.env.DEPLOY_PRIME_URL : 'https://learnstorybook.com';

module.exports = {
  siteMetadata: {
    title: 'Storybook Tutorials',
    description:
      'Learn Storybook teaches frontend developers how to create UIs with components and design systems. Our free in-depth guides are created by Storybook maintainers and peer-reviewed by the open source community.',
    permalink,
    siteUrl: permalink,
    githubUrl: 'https://github.com/chromaui/learnstorybook.com',
    contributeUrl: 'https://github.com/chromaui/learnstorybook.com/#contribute',
    storybookVersion: 6.1,
    tutorialStatus: {
      'intro-to-storybook': {
        react: {
          de: 5.3,
          en: 6.1,
          es: 5.3,
          fr: 6.1,
          ja: 6.1,
          ko: 6.1,
          nl: 5.3,
          pt: 5.3,
          'zh-CN': 5.3,
          'zh-TW': 5.3,
        },
        'react-native': {
          en: 5.3,
          es: 5.3,
        },
        vue: {
          en: 6.1,
          es: 5.3,
          fr: 5.3,
          pt: 5.3,
        },
        angular: {
          en: 5.3,
          es: 5.3,
          pt: 5.3,
        },
        svelte: {
          en: 5.3,
          es: 5.3,
        },
      },
      'design-systems-for-developers': {
        react: {
          en: 6.1,
          ko: 6.1,
          pt: 5.3,
        },
      },
      'visual-testing-handbook': {
        react: {
          en: 6.1,
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
    `gatsby-transformer-remark`,
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
