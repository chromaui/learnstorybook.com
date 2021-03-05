import React from 'react';
import TableOfContents from './TableOfContents';

export const TableOfContentsData = [
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

export default {
  component: TableOfContents,
  excludeStories: /.*Data$/,
  title: 'Screens/GuideScreen/TableOfContents',
};

const Story = args => <TableOfContents {...args} />;
export const Default = Story.bind({});
Default.args = {
  entries: [...TableOfContentsData],
};
