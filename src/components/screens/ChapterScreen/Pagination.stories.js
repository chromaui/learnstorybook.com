import React from 'react';
import Pagination from './Pagination';

export default {
  component: Pagination,
  excludeStories: /.*Data$/,
  title: 'Screens|ChapterScreen/Pagination',
};
const PaginationData = {
  description: 'The description of the next chapter',
  slug: '/slug',
  title: 'Chapter Title',
};

export const WithoutNextEntry = () => <Pagination />;
export const WithNextEntry = () => <Pagination nextEntry={PaginationData} />;
