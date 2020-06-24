import React from 'react';
import Guide from './Guide';

export default {
  component: Guide,
  title: 'Screens/IndexScreen/Guide',
};

export const Basic = args => <Guide {...args} />;
Basic.storyName = 'default';
Basic.args = {
  chapterCount: 10,
  themeColor: '#6F2CAC',
  title: 'Intro to Storybook',
  description:
    "Learn to create bulletproof UI components, along the way you'll build an app UI from scratch.",
  imagePath: '/guide-thumb/intro.svg',
};
