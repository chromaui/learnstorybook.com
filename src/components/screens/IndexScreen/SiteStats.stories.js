import React from 'react';
import { storiesOf } from '@storybook/react';
import SiteStats from './SiteStats';

const props = {
  chapterCount: 5,
  guidesEdges: [
    {
      node: {
        frontmatter: {
          editionCount: 10,
        },
      },
    },
  ],
};

storiesOf('Screens|IndexScreen/SiteStats', module).add('default', () => <SiteStats {...props} />);
