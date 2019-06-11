const path = require('path');

const { createFilePath } = require(`gatsby-source-filesystem`);

const languageNameMap = {
  en: 'English',
  es: 'Español',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  pt: 'Português',
};

// slug starts and ends with '/' so parts[0] and parts[-1] will be empty
const getSlugParts = slug => slug.split('/').filter(p => !!p);

const onCreateGuideNode = ({ actions, node, slug }) => {
  const { createNodeField } = actions;
  const parts = getSlugParts(slug);
  const [guide] = parts;

  createNodeField({ node, name: 'guide', value: guide });
  createNodeField({ node, name: 'slug', value: slug });
  createNodeField({ node, name: 'pageType', value: 'guide' });
};

const onCreateChapterNode = ({ actions, node, slug }) => {
  const { createNodeField } = actions;
  const parts = getSlugParts(slug);
  const [guide, framework, language, chapter] = parts;

  createNodeField({ node, name: 'guide', value: guide });
  createNodeField({ node, name: 'slug', value: slug });
  createNodeField({ node, name: 'framework', value: framework });
  createNodeField({ node, name: 'language', value: language });
  createNodeField({ node, name: 'languageName', value: languageNameMap[language] });
  createNodeField({ node, name: 'chapter', value: chapter });
  createNodeField({ node, name: 'pageType', value: 'chapter' });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({
      node,
      getNode,
      basePath: 'content',
    });

    // slug starts and ends with '/' so parts[0] and parts[-1] will be empty
    const parts = slug.split('/').filter(p => !!p);

    if (parts.length === 1) {
      onCreateGuideNode({ actions, node, slug });
      return;
    }

    if (parts.length === 4) {
      onCreateChapterNode({ actions, node, slug });
      return;
    }

    throw new Error(`Unexpected node path of length !== 1 || !== 4: ${slug}`);
  }
};

const createChapterPage = ({ createPage, node }) => {
  const { guide, slug, framework, language, chapter, pageType } = node.fields;

  createPage({
    path: slug,
    component: path.resolve(`./src/dynamic-pages/${guide}/chapter.js`),
    context: {
      // Data passed to context is available in page queries as GraphQL variables.
      guide,
      slug,
      framework,
      language,
      chapter,
      pageType,
    },
  });
};

const createGuidePage = ({ createPage, node }) => {
  const { guide, slug, pageType } = node.fields;

  createPage({
    path: slug,
    component: path.resolve(`./src/templates/guide.js`),
    context: {
      // Data passed to context is available in page queries as GraphQL variables.
      guide,
      slug,
      pageType,
    },
  });
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise(resolve => {
    graphql(`
      {
        pages: allMarkdownRemark {
          edges {
            node {
              fields {
                guide
                slug
                framework
                language
                languageName
                chapter
                pageType
              }
            }
          }
        }
      }
    `).then(({ data: { pages: { edges } } }) => {
      edges.forEach(({ node }) => {
        const { pageType, slug } = node.fields;

        if (pageType === 'chapter') {
          createChapterPage({ createPage, node });
          return;
        }

        if (pageType === 'guide') {
          createGuidePage({ createPage, node });
          return;
        }

        throw new Error(`Unexpected pageType !== 'chapter' || !== 'guide': ${slug}`);
      });
      resolve();
    });
  });
};
