import React from 'react';
import { storiesOf } from '@storybook/react';
import GuideScreen from './index';

const props = {
  data: {
    currentPage: {
      html: '<div>The html</div>',
      frontmatter: {
        authors: [
          {
            name: 'Author name',
            detail: 'A person who does things',
            src: 'https://avatars2.githubusercontent.com/u/263385',
          },
        ],
        contributors: [
          {
            name: 'Contributor name',
            detail: 'Another person who does things',
            src: 'https://avatars2.githubusercontent.com/u/263385',
          },
        ],
        contributorCount: '+34',
        coverImagePath: '/guide-cover/intro.svg',
        description: 'A good guide',
        heroDescription: 'This is the hero description for the guide.',
        languages: ['en'],
        themeColor: '#6F2CAC',
        toc: ['chapter-slug', 'do-something-else'],
        title: 'The guide title',
        overview: 'A guide that does a thing that you should for sure learn.',
      },
      fields: {
        chapter: '/chapter-slug',
        guide: 'sample-guide',
        language: 'en',
        slug: '/chapter-slug',
      },
    },
    site: {
      siteMetadata: {
        title: 'Learn Storybook',
      },
    },
    pages: {
      edges: [
        {
          node: {
            frontmatter: {
              title: 'Chapter 1',
              description: 'Chapter 1 description',
            },
            fields: {
              slug: '/chapter-slug',
              chapter: 'chapter-slug',
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
              chapter: 'chapter-2-slug',
            },
          },
        },
      ],
    },
  },
};

storiesOf('Screens|GuideScreen/index', module)
  .addParameters({ component: GuideScreen })
  .add('default', () => <GuideScreen {...props} />);
