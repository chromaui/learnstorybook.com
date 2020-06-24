import React from 'react';
import SiteStats from './SiteStats';

export default {
  component: SiteStats,
  title: 'Screens/IndexScreen/SiteStats',
};

export const Basic = args => <SiteStats {...args} />;
Basic.storyName = 'default';
Basic.args = {
  chapterCount: 5,
  guideCount: 9,
  allEditionsChaptersEdges: [
    {
      node: {
        fields: {
          slug: '/guide/edition/page',
        },
      },
    },
    {
      node: {
        fields: {
          slug: '/guide/edition/page2',
        },
      },
    },
    {
      node: {
        fields: {
          slug: '/guide/edition2/page',
        },
      },
    },
  ],
};
