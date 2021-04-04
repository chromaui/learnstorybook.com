import React from 'react';
import GuideScreen from './index';
import { ContributorsData } from './Contributors.stories';

export default {
  component: GuideScreen,
  title: 'Screens/GuideScreen/index',
};

const Story = args => <GuideScreen {...args} />;
export const Default = Story.bind({});
Default.args = {
  data: {
    currentPage: {
      html: '<div>The html</div>',
      frontmatter: {
        ...ContributorsData,
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
        permalink: 'https://storybook.js.org/tutorials',
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
    translationPages: {
      edges: [
        {
          node: {
            fields: {
              language: 'en',
            },
          },
        },
        {
          node: {
            fields: {
              language: 'es',
            },
          },
        },
      ],
    },
  },
  pageContext: {
    slug: '/intro-to-storybook/',
  },
};
