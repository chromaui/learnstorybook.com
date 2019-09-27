module.exports = {
  siteMetadata: {
    title: 'Storybook Tutorials',
    description:
      'Learn Storybook teaches frontend developers how to create UIs with components and design systems. Our free in-depth guides are created by Storybook maintainers and peer-reviewed by the open source community.',
    permalink: 'https://learnstorybook.com',
    siteUrl: 'https://learnstorybook.com',
    githubUrl: 'https://github.com/chromaui/learnstorybook.com',
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
