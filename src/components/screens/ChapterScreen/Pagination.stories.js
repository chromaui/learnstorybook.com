import React from 'react';
import { storiesOf } from '@storybook/react';
import Pagination from './Pagination';

const nextEntry = {
  description: 'The description of the next chapter',
  slug: '/slug',
  title: 'Chapter Title',
};

storiesOf('Screens|ChapterScreen/Pagination', module)
  .add('without nextEntry', () => <Pagination />)
  .add('with nextEntry', () => <Pagination nextEntry={nextEntry} />);
