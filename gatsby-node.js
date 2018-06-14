const path = require('path');

const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  if (node.internal.type === `MarkdownRemark`) {
    const { createNodeField } = boundActionCreators;
    const slug = createFilePath({
      node,
      getNode,
      basePath: `content`,
    });

    // slug starts and ends with '/' so parts[0] and parts[-1] will be empty
    const parts = slug.split('/').filter(p => !!p);

    if (parts.length !== 3) {
      throw new Error(`Unexpected node path of length !== 3: ${slug}`);
    }

    const [framework, language, chapter] = parts;

    createNodeField({ node, name: `slug`, value: slug });
    createNodeField({ node, name: `framework`, value: framework });
    createNodeField({ node, name: `language`, value: language });
    createNodeField({ node, name: `chapter`, value: chapter });
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage, createRedirect } = boundActionCreators;

  return new Promise(resolve => {
    graphql(`
      {
        pages: allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                framework
                language
                chapter
              }
            }
          }
        }
      }
    `).then(({ data: { pages: { edges } } }) => {
      edges.forEach(({ node }) => {
        const { slug, framework, language, chapter } = node.fields;

        // FIXME: don't hardcode this
        if (framework === 'react' && language === 'en') {
          // Redirect the old URL format (/get-started)
          createRedirect({
            fromPath: `/${chapter}/`,
            isPermanent: true,
            redirectInBrowser: true,
            toPath: slug,
          });
        }

        createPage({
          path: slug,
          component: path.resolve(`./src/templates/chapter.js`),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug,
            framework,
            language,
            chapter,
          },
        });
      });
      resolve();
    });
  });
};
