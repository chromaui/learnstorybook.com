import React from 'react';
import SiteStats from './SiteStats';

export default {
  component: SiteStats,
  title: 'Screens/IndexScreen/SiteStats',
};

function Story(args) {
  return <SiteStats {...args} />;
}
export const Default = Story.bind({});
Default.args = {
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
