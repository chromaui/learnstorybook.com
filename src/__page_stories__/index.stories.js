import React from 'react';
import { storiesOf } from '@storybook/react';
import Index from '../pages/index';

const props = {
  data: {
    guides: {
      edges: [
        {
          node: {
            frontmatter: {
              description: 'This is the guide description that explains what you find in the guide',
              editionCount: 2,
              imagePath: '/books.svg',
              themeColor: 'purple',
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

storiesOf('Pages|Index', module).add('default', () => <Index {...props} />);
