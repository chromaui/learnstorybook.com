import React from 'react';
import { storiesOf } from '@storybook/react';
import IndexScreen from './index';

const props = {
  data: {
    guides: {
      edges: [
        {
          node: {
            frontmatter: {
              description: 'This is the guide description that explains what you find in the guide',
              imagePath: '/books.svg',
              themeColor: '#6F2CAC',
              title: 'Guide title',
            },
            fields: {
              guide: 'guide',
              slug: '/guide',
            },
          },
        },
      ],
    },
    chapters: {
      edges: [
        {
          node: {
            fields: {
              guide: 'guide',
            },
          },
        },
        {
          node: {
            fields: {
              guide: 'guide',
            },
          },
        },
      ],
    },
  },
};

storiesOf('Screens|IndexScreen/index', module).add('default', () => <IndexScreen {...props} />);
