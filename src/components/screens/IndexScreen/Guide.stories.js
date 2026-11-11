import React from 'react';
import Guide from './Guide';

export default {
  component: Guide,
  title: 'Screens/IndexScreen/Guide',
};

const Story = (args) => <Guide {...args} />;
export const Default = Story.bind({});
Default.args = {
  chapterCount: 10,
  themeColor: '#6F2CAC',
  title: 'Intro to Storybook',
  description:
    "Learn to create bulletproof UI components, along the way you'll build an app UI from scratch.",
  imagePath: '/guide-thumb/intro.svg',
};

export const New = Story.bind({});
New.storyName = 'new guide with gradient theme';
New.args = {
  chapterCount: 8,
  themeColor: '#EA580C',
  themeGradientName: 'sunrise',
  isNew: true,
  title: 'Make your Design System AI-ready',
  description:
    'Give coding agents the context, docs and feedback loops they need to build with your components.',
  imagePath: '/guide-thumb/ai-ready-design-systems.svg',
};

export const BadgeOnSolidColor = Story.bind({});
BadgeOnSolidColor.storyName = 'new badge on a solid theme color';
BadgeOnSolidColor.args = { ...Default.args, isNew: true };
