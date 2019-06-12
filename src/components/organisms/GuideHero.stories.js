import React from 'react';
import { storiesOf } from '@storybook/react';
import GuideHero from './GuideHero';

const props = {
  description:
    "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.",
  imagePath: '/books.svg',
  languages: ['en', 'es', 'zh-CN', 'zh-TW', 'pt'],
  themeColor: 'purple',
  title: 'Visual Testing Handbook',
};

storiesOf('Organisms|GuideHero', module)
  .add('default', () => <GuideHero {...props} />)
  .add('with contributor count', () => <GuideHero {...props} contributorCount="34+" />);
