import React from 'react';
import Sidebar from './Sidebar';
import { TableOfContentsData } from './TableOfContents.stories';

export default {
  component: Sidebar,
  title: 'Screens/ChapterScreen/Sidebar',
  args: {
    entries: TableOfContentsData.entries,
    chapter: 'chapter',
    contributeUrl: '/contribute',
    firstChapter: 'get-started',
    framework: 'react',
    guide: 'guide',
    guideTitle: 'Guide Title',
    language: 'en',
    slug: TableOfContentsData.currentPageSlug,
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

export const Default = args => <Sidebar {...args} />;
