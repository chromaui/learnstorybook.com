import React from 'react';
import Guides from './Guides';

export default {
  component: Guides,
  title: 'Screens/IndexScreen/Guides',
};

export const Basic = args => <Guides {...args} />;
Basic.storyName = 'default';
Basic.args = {
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
