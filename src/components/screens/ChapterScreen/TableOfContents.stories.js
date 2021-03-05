import React from 'react';
import TableOfContents from './TableOfContents';

export const TableOfContentsData = {
  currentPageSlug: '/slug-1',
  entries: [{ slug: '/slug-1', title: 'Chapter 1' }, { slug: '/slug-2', title: 'Chapter 2' }],
};
export default {
  component: TableOfContents,
  excludeStories: /.*Data$/,
  title: 'Screens/ChapterScreen/TableOfContents',
};

const Story = args => <TableOfContents {...args} />;
export const Default = Story.bind({});
Default.args = {
  ...TableOfContentsData,
};
