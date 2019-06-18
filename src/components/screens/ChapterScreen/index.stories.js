import React from 'react';
import { storiesOf } from '@storybook/react';
import Chapter from './index';

const props = {
  data: {
    currentPage: {
      html: '<div>The html</div>',
      frontmatter: {
        commit: '123456789',
        title: 'Chapter Title',
        description: 'A good chapter',
      },
      fields: {
        chapter: 'chapter-1',
        framework: 'react',
        guide: 'sample-guide',
        language: 'en',
        slug: '/chapter-slug',
      },
    },
    currentGuide: {
      frontmatter: {
        languages: ['en'],
        toc: ['chapter-1', 'chapter-2'],
      },
    },
    site: {
      siteMetadata: {
        githubUrl: 'https://github.com',
        codeGithubUrl: 'https://github.com',
        title: 'Learn Storybook',
      },
    },
    tocPages: {
      edges: [
        {
          node: {
            frontmatter: {
              title: 'Chapter 1',
              description: 'Chapter 1 description',
            },
            fields: {
              slug: '/chapter-slug',
              chapter: 'chapter-1',
            },
          },
        },
        {
          node: {
            frontmatter: {
              title: 'Chapter 2',
              description: 'Chapter 2 description',
            },
            fields: {
              slug: '/chapter-2-slug',
              chapter: 'chapter-2',
            },
          },
        },
      ],
    },
    translationPages: {
      edges: [
        {
          node: {
            frontmatter: {
              title: 'Chapter 1',
              description: 'Chapter 1 description',
            },
            fields: {
              framework: 'react',
              slug: '/chapter-slug',
              chapter: 'chapter-1',
              language: 'en',
            },
          },
        },
        {
          node: {
            frontmatter: {
              title: 'Chapter 2',
              description: 'Chapter 2 description',
            },
            fields: {
              framework: 'react',
              slug: '/chapter-2-slug',
              chapter: 'chapter-2',
              language: 'en',
            },
          },
        },
      ],
    },
  },
};

storiesOf('Screens|ChapterScreen/index', module)
  .addParameters({ component: Chapter })
  .add('default', () => <Chapter {...props} />);
