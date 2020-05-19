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
        permalink: 'https://learnstorybook.com/sample-guide',
        slug: '/chapter-slug',
      },
    },
    currentGuide: {
      frontmatter: {
        codeGithubUrl: 'https://github.com',
        languages: ['en'],
        title: 'Guide Title',
        toc: ['chapter-1', 'chapter-2'],
        guideInformation: [
          {
            framework: 'react',
            currentGuideVersion: [
              {
                language: 'en',
                version: 5.3,
              },
            ],
          },
        ],
      },
    },
    site: {
      siteMetadata: {
        githubUrl: 'https://github.com',
        contributeUrl: 'https://github.com',
        permalink: 'https://learnstorybook.com',
        title: 'Learn Storybook',
        currentStorybookVersion: 5.3,
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

const translatedProps = {
  data: {
    ...props.data,
    currentPage: {
      ...props.data.currentPage,
      fields: {
        chapter: 'chapter-1',
        framework: 'react',
        guide: 'sample-guide',
        language: 'es',
        permalink: 'https://learnstorybook.com/sample-guide',
        slug: '/chapter-slug',
      },
    },
    currentGuide: {
      frontmatter: {
        codeGithubUrl: 'https://github.com',
        languages: ['es'],
        title: 'Guide Title',
        toc: ['chapter-1', 'chapter-2'],
        guideInformation: [
          {
            framework: 'react',
            currentGuideVersion: [
              {
                language: 'es',
                version: 5.2,
              },
            ],
          },
        ],
      },
    },
  },
};
storiesOf('Screens|ChapterScreen/index', module)
  .addParameters({ component: Chapter })
  .add('default', () => <Chapter {...props} />)
  .add('without outdated version', () => <Chapter {...translatedProps} />);
