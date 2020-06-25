import React from 'react';
import Contributors from './Contributors';

export default {
  component: Contributors,
  title: 'Screens/GuideScreen/Contributors',
  args: {
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
  },
};

export const Default = args => <Contributors {...args} />;
