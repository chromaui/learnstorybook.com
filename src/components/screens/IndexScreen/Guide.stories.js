import React from 'react';
import { storiesOf } from '@storybook/react';
import Guide from './Guide';

const props = {
  chapterCount: 10,
  themeColor: '#6F2CAC',
  title: 'Intro to Storybook',
  description:
    "Learn to create bulletproof UI components, along the way you'll build an app UI from scratch.",
  imagePath: '/guide-thumb/intro.svg',
};

storiesOf('Screens|IndexScreen/Guide', module).add('default', () => <Guide {...props} />);
