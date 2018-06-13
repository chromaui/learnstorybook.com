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

    if (parts.length > 2) {
      throw new Error(`Unexpected node path of length > 2: ${slug}`);
    }

    let chapterSlug = parts[0];
    let language = 'english';
    if (parts.length > 1) {
      [language, chapterSlug] = parts;
    }

    createNodeField({ node, name: `slug`, value: slug });
    createNodeField({ node, name: `language`, value: language });
    createNodeField({ node, name: `chapterSlug`, value: chapterSlug });
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise(resolve => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                language
                chapterSlug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        const { slug, language, chapterSlug } = node.fields;
        createPage({
          path: slug,
          component: path.resolve(`./src/templates/chapter.js`),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug,
            language,
            chapterSlug,
          },
        });
      });
      resolve();
    });
  });
};
