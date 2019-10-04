import React from 'react';
import { storiesOf } from '@storybook/react';
import Contributors from './Contributors';

const props = {
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

storiesOf('Screens|GuideScreen/Contributors', module)
  .addParameters({ component: Contributors })
  .add('default', () => <Contributors {...props} />);
