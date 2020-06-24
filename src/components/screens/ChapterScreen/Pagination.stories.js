import React from 'react';
import Pagination from './Pagination';

export default {
  component: Pagination,
  title: 'Screens/ChapterScreen/Pagination',
};

export const Basic = args => <Pagination {...args} />;
Basic.storyName = 'without nextEntry';

export const WithNextEntry = Basic.bind();
WithNextEntry.storyName = 'with nextEntry';
WithNextEntry.args = {
  nextEntry: {
    description: 'The description of the next chapter',
    slug: '/slug',
    title: 'Chapter Title',
  },
};
