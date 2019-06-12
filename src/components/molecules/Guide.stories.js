import React from 'react';
import { storiesOf } from '@storybook/react';
import Guide from './Guide';

const props = {
  themeColor: 'purple',
  title: 'Intro to Storybook',
  description:
    "Learn to create bulletproof UI components, along the way you'll build an app UI from scratch.",
  imagePath: '/books.svg',
};

storiesOf('Molecules|Guide', module).add('default', () => <Guide {...props} />);
