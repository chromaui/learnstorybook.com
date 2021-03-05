import React from 'react';
import Guide from './Guide';

export default {
  component: Guide,
  title: 'Screens/IndexScreen/Guide',
};

const Story = args => <Guide {...args} />;
export const Default = Story.bind({});
Default.args = {
  chapterCount: 10,
  themeColor: '#6F2CAC',
  title: 'Intro to Storybook',
  description:
    "Learn to create bulletproof UI components, along the way you'll build an app UI from scratch.",
  imagePath: '/guide-thumb/intro.svg',
};
