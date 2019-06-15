import React from 'react';
import { storiesOf } from '@storybook/react';
import Guides from './Guides';

const props = {
  chaptersEdges: [
    {
      node: {
        fields: {
          guide: 'guide',
        },
      },
    },
  ],
  guidesEdges: [
    {
      node: {
        fields: {
          guide: 'guide',
          slug: '/guide',
        },
        frontmatter: {
          description: 'The guide description',
          imagePath: '/books.svg',
          themeColor: '#6F2CAC',
          title: 'Guide Title',
        },
      },
    },
  ],
};

storiesOf('Screens|IndexScreen/Guides', module).add('default', () => <Guides {...props} />);
