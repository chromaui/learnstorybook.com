import React from 'react';
import SiteStats from './SiteStats';

export default {
  component: SiteStats,
  excludeStories: /.*Data$/,
  title: 'Screens|IndexScreen/SiteStats',
};

const SiteStatsData = {
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

export const Default = () => <SiteStats {...SiteStatsData} />;
