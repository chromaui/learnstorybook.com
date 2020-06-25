import React from 'react';
import Pagination from './Pagination';

export default {
  component: Pagination,
  title: 'Screens/ChapterScreen/Pagination',
};

export const WithoutNextEntry = args => <Pagination {...args} />;
export const WithNextEntry = WithoutNextEntry.bind();
WithNextEntry.args = {
  nextEntry: {
    description: 'The description of the next chapter',
    slug: '/slug',
    title: 'Chapter Title',
  },
};
