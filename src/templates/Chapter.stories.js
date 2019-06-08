import React from 'react';
import { storiesOf } from '@storybook/react';
import Chapter from './chapter';

const buildPageNode = id => ({
  html: '<div>The page HTML</div>',
  frontmatter: {
    title: `Chapter ${id}`,
    description: `Chapter ${id} description`,
    commit: 'CurrentPageCommit',
  },
  fields: {
    slug: `page-chapter-${id}`,
    chapter: `page-chapter-${id}`,
    framework: 'framework',
    language: 'current-page-language',
    languageName: 'Language Name',
  },
});

const props = {
  data: {
    currentPage: buildPageNode('1'),
    site: {
      siteMetadata: {
        title: 'SiteTitle',
        toc: ['page-chapter-1', 'page-chapter-2'],
        languages: ['en'],
        githubUrl: 'SiteGithubUrl',
        codeGithubUrl: 'SiteCodeGithubUrl',
        siteUrl: 'SiteSiteUrl',
      },
    },
    pages: {
      edges: [
        {
          node: buildPageNode('1'),
        },
        {
          node: buildPageNode('2'),
        },
      ],
    },
  },
};

storiesOf('Templates|Chapter', module).add('default', () => <Chapter {...props} />);
