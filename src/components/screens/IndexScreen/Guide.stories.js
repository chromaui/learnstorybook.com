import React from 'react';
import Guide from './Guide';

export default {
  component: Guide,
  excludeStories: /.*Data$/,
  title: 'Screens|IndexScreen/Guide',
};
const GuideData = {
  chapterCount: 10,
  themeColor: '#6F2CAC',
  title: 'Intro to Storybook',
  description:
    "Learn to create bulletproof UI components, along the way you'll build an app UI from scratch.",
  imagePath: '/guide-thumb/intro.svg',
};
export const Default = () => <Guide {...GuideData} />;
