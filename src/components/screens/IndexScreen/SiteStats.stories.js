import React from 'react';
import { storiesOf } from '@storybook/react';
import SiteStats from './SiteStats';

const props = {
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

storiesOf('Screens|IndexScreen/SiteStats', module)
  .addParameters({ component: SiteStats })
  .add('default', () => <SiteStats {...props} />);
