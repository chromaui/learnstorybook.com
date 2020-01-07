import React from 'react';
import TableOfContents from './TableOfContents';

export default {
  component: TableOfContents,
  excludeStories: /.*Data$/,
  title: 'Screens|ChapterScreen/TableOfContents',
};

export const TableOfContentsData = {
  currentPageSlug: '/slug-1',
  entries: [
    { slug: '/slug-1', title: 'Chapter 1' },
    { slug: '/slug-2', title: 'Chapter 2' },
  ],
};

export const Default = () => (
  <TableOfContents
    currentPageSlug={TableOfContentsData.currentPageSlug}
    entries={TableOfContentsData.entries}
  />
);
