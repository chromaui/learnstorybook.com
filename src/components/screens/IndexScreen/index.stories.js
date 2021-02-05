import React from 'react';
import IndexScreen from './index';

export default {
  component: IndexScreen,
  title: 'Screens/IndexScreen/index',
};

const Story = args => <IndexScreen {...args} />;
export const Default = Story.bind({});
Default.args = {
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
              description: `Learn to create bulletproof UI components, along the way you'll build an app UI from scratch.`,
              title: 'Intro to Storybook',
              themeColor: '#6F2CAC',
              thumbImagePath: '/guide-thumb/intro.svg',
            },
            fields: {
              guide: 'guide',
              slug: '/guide',
            },
          },
        },
        {
          node: {
            frontmatter: {
              description: 'Discover how to build and maintain design systems using Storybook.',
              title: 'Design Systems for Developers',
              themeColor: '#0079FF',
              thumbImagePath: '/guide-thumb/design-system.svg',
            },
            fields: {
              guide: 'guide',
              slug: '/guide',
            },
          },
        },
        {
          node: {
            frontmatter: {
              description:
                '✍️Coming soon: Visual testing is a pragmatic yet precise way to check UI appearance.',
              title: 'Visual Testing Handbook',
              themeColor: '#129F00',
              thumbImagePath: '/guide-thumb/visual-testing.svg',
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
