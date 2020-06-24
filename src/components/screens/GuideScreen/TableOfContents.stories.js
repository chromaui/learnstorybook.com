import React from 'react';
import TableOfContents from './TableOfContents';

export default {
  component: TableOfContents,
  excludeStories: /.*Data$/,
  title: 'Screens/GuideScreen/TableOfContents',
};
const TableOfContentsData = [
  {
    description: 'Guide 1 description',
    slug: '/guide-1',
    title: 'Guide 1',
  },
  {
    description: 'Guide 2 description',
    slug: '/guide-2',
    title: 'Guide 2',
  },
];

export const Basic = () => <TableOfContents entries={TableOfContentsData} />;
Basic.storyName = 'default';
