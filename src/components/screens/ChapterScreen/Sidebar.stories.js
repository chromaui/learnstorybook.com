import React from 'react';
import { storiesOf } from '@storybook/react';
import Sidebar from './Sidebar';

const currentPageSlug = '/slug-1';

const entries = [
  { slug: currentPageSlug, title: 'Chapter 1' },
  { slug: '/slug-2', title: 'Chapter 2' },
];

storiesOf('Screens|ChapterScreen/Sidebar', module)
  .addParameters({ component: Sidebar })
  .add('default', () => (
    <Sidebar
      entries={entries}
      chapter="chapter"
      contributeUrl="/contribute"
      firstChapter="get-started"
      framework="react"
      guide="guide"
      language="en"
      slug={currentPageSlug}
      translationPages={{
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
      }}
    />
  ));
