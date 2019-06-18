import React from 'react';
import { storiesOf } from '@storybook/react';
import TableOfContents from './TableOfContents';

const currentPageSlug = 'slug-1';

const entries = [
  { slug: currentPageSlug, title: 'Chapter 1' },
  { slug: 'slug-2', title: 'Chapter 2' },
];

storiesOf('Screens|ChapterScreen/TableOfContents', module)
  .addParameters({ component: TableOfContents })
  .add('default', () => <TableOfContents currentPageSlug={currentPageSlug} entries={entries} />);
