const path = require('path');
const config = require('./gatsby-config');

const { createFilePath } = require(`gatsby-source-filesystem`);

const defaultLanguage = 'en';
const defaultFramework = 'react';

// slug starts and ends with '/' so parts[0] and parts[-1] will be empty
const getSlugParts = slug => slug.split('/').filter(p => !!p);

const onCreateGuideNode = ({ actions, node, slug }) => {
  const { createNodeField } = actions;
  const parts = getSlugParts(slug);
  const [guide] = parts;

  createNodeField({ node, name: 'guide', value: guide });
  createNodeField({ node, name: 'slug', value: slug });
  createNodeField({ node, name: 'permalink', value: `${config.siteMetadata.permalink}${slug}` });
  createNodeField({ node, name: 'pageType', value: 'guide' });
};

const onCreateNonFrameworkChapterNode = ({ actions, node, slug }) => {
  const { createNodeField } = actions;
  const parts = getSlugParts(slug);
  const [guide, language, chapter] = parts;

  createNodeField({ node, name: 'guide', value: guide });
  createNodeField({ node, name: 'slug', value: slug });
  createNodeField({ node, name: 'permalink', value: `${config.siteMetadata.permalink}${slug}` });
  createNodeField({ node, name: 'language', value: language });
  createNodeField({ node, name: 'chapter', value: chapter });
  createNodeField({ node, name: 'pageType', value: 'chapter' });
  createNodeField({ node, name: 'isDefaultTranslation', value: language === defaultLanguage });
};

const onCreateFrameworkChapterNode = ({ actions, node, slug }) => {
  const { createNodeField } = actions;
  const parts = getSlugParts(slug);
  const [guide, framework, language, chapter] = parts;

  createNodeField({ node, name: 'guide', value: guide });
  createNodeField({ node, name: 'slug', value: slug });
  createNodeField({ node, name: 'permalink', value: `${config.siteMetadata.permalink}${slug}` });
  createNodeField({ node, name: 'framework', value: framework });
  createNodeField({ node, name: 'language', value: language });
  createNodeField({ node, name: 'chapter', value: chapter });
  createNodeField({ node, name: 'pageType', value: 'chapter' });
  createNodeField({
    node,
    name: 'isDefaultTranslation',
    value: language === defaultLanguage && framework === defaultFramework,
  });
  const { siteMetadata } = config;
  const { storybookVersion, tutorialStatus } = siteMetadata;

  const currentGuide = tutorialStatus[guide];
  const currentFramework = currentGuide[framework];

  // checks if the framework is defined
  if (!currentFramework) {
    return;
  }
  // gets and checks if the translation is defined
  const currentVersion = currentFramework[language];
  if (!currentVersion) {
    return;
  }
  createNodeField({ node, name: 'tutorialUpToDate', value: storybookVersion === currentVersion });
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

    if (parts.length === 3) {
      onCreateNonFrameworkChapterNode({ actions, node, slug });
      return;
    }

    if (parts.length === 4) {
      onCreateFrameworkChapterNode({ actions, node, slug });
      return;
    }

    throw new Error(`Unexpected node path of length !== 1 || !== 4: ${slug}`);
  }
};

const createChapterPage = ({ createPage, node }) => {
  const {
    guide,
    slug,
    framework,
    language,
    chapter,
    pageType,
    isDefaultTranslation,
    permalink,
  } = node.fields;

  createPage({
    path: slug,
    component: path.resolve(`./src/components/screens/ChapterScreen/index.js`),
    context: {
      // Data passed to context is available in page queries as GraphQL variables.
      guide,
      slug,
      framework,
      language,
      chapter,
      pageType,
      permalink,
      isDefaultTranslation,
    },
  });
};

const createGuidePage = ({ createPage, node }) => {
  const { guide, slug, pageType, permalink } = node.fields;

  createPage({
    path: slug,
    component: path.resolve(`./src/components/screens/GuideScreen/index.js`),
    context: {
      // Data passed to context is available in page queries as GraphQL variables.
      guide,
      slug,
      permalink,
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
