module.exports = {
  siteMetadata: {
    title: 'Learn Storybook',
    description:
      'Learn how to create bulletproof UI components as you build an app UI from scratch in Storybook.',
    permalink: 'https://learnstorybook.com',
    toc: [
      '/get-started/',
      '/simple-component/',
      '/composite-component/',
      '/data/',
      '/screen/',
      '/test/',
      '/deploy/',
      '/conclusion/',
      '/contribute/',
    ],
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
      resolve: `gatsby-plugin-segment-js`,
      options: {
        // your segment write key for your production environment
        // when process.env.NODE_ENV === 'production'
        // required; non-empty string
        prodKey: `JXEYLKE1T9ptsDlNqeNIMdoOy1Ept8CB`,

        // if you have a development env for your segment account, paste that key here
        // when process.env.NODE_ENV === 'development'
        // optional; non-empty string
        devKey: null,

        // whether you want to include analytics.page()
        // optional; boolean that defaults to true
        // if false, then don't forget to manually add it to your codebase manually!
        trackPage: true,
      },
    },
  ],
};
