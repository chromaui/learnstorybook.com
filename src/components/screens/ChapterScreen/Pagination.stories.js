import React from 'react';
import Pagination from './Pagination';

export default {
  component: Pagination,
  title: 'Screens/ChapterScreen/Pagination',
};

const Story = args => <Pagination {...args} />;

export const WithoutNextEntry = Story.bind({});
export const WithNextEntry = Story.bind({});
WithNextEntry.args = {
  nextEntry: {
    description: 'The description of the next chapter',
    slug: '/slug',
    title: 'Chapter Title',
  },
};
