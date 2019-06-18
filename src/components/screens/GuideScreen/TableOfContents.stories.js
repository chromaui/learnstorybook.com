import React from 'react';
import { storiesOf } from '@storybook/react';
import TableOfContents from './TableOfContents';

const entries = [
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

storiesOf('Screens|GuideScreen/TableOfContents', module)
  .addParameters({ component: TableOfContents })
  .add('default', () => <TableOfContents entries={entries} />);
