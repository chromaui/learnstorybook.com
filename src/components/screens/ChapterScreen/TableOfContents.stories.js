import React from 'react';
import { storiesOf } from '@storybook/react';
import TableOfContents from './TableOfContents';

const currentPageSlug = '/slug-1';

const entries = [
  {
    slug: currentPageSlug,
    title: 'Chapter 1',
    chapterNavItems: [
      {
        chapterNavText: 'Setup',
        chapterNavLink: '/intro-to-storybook/react/en/get-started/#setup-react-storybook',
      },
      {
        chapterNavText: 'Reuse CSS',
        chapterNavLink: '/intro-to-storybook/react/en/get-started/#reuse-css',
      },
    ],
  },
  { slug: '/slug-2', title: 'Chapter 2', chapterNavItems: [] },
];

storiesOf('Screens|ChapterScreen/TableOfContents', module)
  .addParameters({ component: TableOfContents })
  .add('default', () => <TableOfContents currentPageSlug={currentPageSlug} entries={entries} />);
