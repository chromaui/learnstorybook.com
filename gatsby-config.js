module.exports = {
  siteMetadata: {
    title: 'Learn Storybook',
    toc: [
      '/introduction/',
      '/setup-storybook/',
      '/simple-component/',
      '/composite-component/',
      '/container-component/',
      '/test/',
      '/screen/',
      '/deploy/',
      '/conclusion/',
      '/contribute/',
    ],
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
  ],
}
