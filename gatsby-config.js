module.exports = {
  siteMetadata: {
    title: 'Learn Storybook',
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
}
