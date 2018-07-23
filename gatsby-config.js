module.exports = {
  siteMetadata: {
    title: 'Storybook Tutorial',
    description:
      'Learn Storybook the UI component development tool for React, Vue, and Angular. This tutorial teaches you Storybook as you build a UI from scratch.',
    permalink: 'https://learnstorybook.com',
    toc: [
      'get-started',
      'simple-component',
      'composite-component',
      'data',
      'screen',
      'test',
      'deploy',
      'conclusion',
      'contribute',
    ],
    languages: ['en', 'es', 'zh-CN', 'zh-TW'],
    defaultTranslation: 'react/en',
    siteUrl: 'https://learnstorybook.com',
    githubUrl: 'https://github.com/hichroma/learnstorybook.com',
    codeGithubUrl: 'https://github.com/hichroma/learnstorybook-code',
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
    `gatsby-transformer-remark`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sitemap`,
    {
      resolve: 'gatsby-plugin-segment',
      options: {
        writeKey: 'JXEYLKE1T9ptsDlNqeNIMdoOy1Ept8CB',
      },
    },
  ],
};
