import React from 'react';
import Guides from './Guides';

export default {
  component: Guides,
  excludeStories: /.*Data$/,
  title: 'Screens|IndexScreen/Guides',
};
const GuidesData = {
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

export const Default = () => <Guides {...GuidesData} />;
