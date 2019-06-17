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
          title: 'Guide Title',
          themeColor: '#6F2CAC',
          thumbImagePath: '/guide-thumb/intro.svg',
        },
      },
    },
  ],
};

storiesOf('Screens|IndexScreen/Guides', module).add('default', () => <Guides {...props} />);
