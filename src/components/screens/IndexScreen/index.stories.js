import React from 'react';
import { storiesOf } from '@storybook/react';
import IndexScreen from './index';

const props = {
  data: {
    allEditionsChapters: {
      edges: [
        {
          node: {
            fields: {
              slug: '/guide',
            },
          },
        },
        {
          node: {
            fields: {
              slug: '/en/guide',
            },
          },
        },
      ],
    },
    guides: {
      edges: [
        {
          node: {
            frontmatter: {
              description: 'This is the guide description that explains what you find in the guide',
              title: 'Guide title',
              themeColor: '#6F2CAC',
              thumbImagePath: '/guide-thumb/intro.svg',
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

storiesOf('Screens|IndexScreen/index', module).add('default', () => <IndexScreen {...props} />, {
  chromatic: { disable: true },
});
