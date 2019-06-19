module.exports = {
  siteMetadata: {
    title: 'Storybook Tutorial',
    description:
      'Learn Storybook the UI component development tool for React, Vue, and Angular. This tutorial teaches you Storybook as you build a UI from scratch.',
    permalink: 'https://learnstorybook.com',
    siteUrl: 'https://learnstorybook.com',
    githubUrl: 'https://github.com/chromaui/learnstorybook.com',
    codeGithubUrl: 'https://github.com/chromaui/learnstorybook-code',
    contributeUrl: 'https://github.com/chromaui/learnstorybook.com/#contribute',
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
    {
      resolve: 'gatsby-plugin-segment',
      options: {
        writeKey: 'JXEYLKE1T9ptsDlNqeNIMdoOy1Ept8CB',
      },
    },
  ],
};
