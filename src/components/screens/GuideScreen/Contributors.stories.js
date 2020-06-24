import React from 'react';
import Contributors from './Contributors';

export default {
  component: Contributors,
  excludeStories: /.*Data$/,
  title: 'Screens/GuideScreen/Contributors',
};

const ContributorsData = {
  authors: [
    {
      name: 'Author name',
      detail: 'A person who does things',
      src: 'https://avatars2.githubusercontent.com/u/263385',
    },
  ],
  contributors: [
    {
      name: 'Contributor name',
      detail: 'Another person who does things',
      src: 'https://avatars2.githubusercontent.com/u/263385',
    },
  ],
};

export const Basic = () => <Contributors {...ContributorsData} />;
Basic.storyName = 'default';
