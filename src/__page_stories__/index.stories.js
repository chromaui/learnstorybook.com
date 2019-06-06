import React from 'react';
import { storiesOf } from '@storybook/react';
import Index from '../pages/index';

const buildPageNode = id => ({
  html: '<div>The page HTML</div>',
  frontmatter: {
    title: `Chapter ${id}`,
    tocTitle: `Chapter ${id}`,
    description: `Chapter ${id} description`,
  },
  fields: {
    slug: `page-chapter-${id}`,
    chapter: `page-chapter-${id}`,
  },
});

const props = {
  data: {
    site: {
      siteMetadata: {
        toc: ['page-chapter-1', 'page-chapter-2'],
        defaultTranslation: ['en'],
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

storiesOf('Pages|Index', module).add('default', () => <Index {...props} />);
