module.exports = {
  siteMetadata: {
    title: 'Learn Storybook',
    description:
      'Learn Storybook to create bulletproof UI components as you build an app UI from scratch.',
    permalink: 'https://learnstorybook.com',
    toc: [
      '/setup/',
      '/simple-component/',
      '/composite-component/',
      '/data/',
      '/screen/',
      '/test/',
      '/deploy/',
      '/conclusion/',
      '/contribute/',
    ],
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
  ],
};
