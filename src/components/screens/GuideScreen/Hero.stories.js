import React from 'react';
import { storiesOf } from '@storybook/react';
import Hero from './Hero';

const props = {
  ctaHref: '/get-started',
  description:
    "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.",
  imagePath: '/guide-cover/intro.svg',
  languages: ['en', 'es', 'zh-CN', 'zh-TW', 'pt'],
  themeColor: '#6F2CAC',
  title: 'Visual Testing Handbook',
};

storiesOf('Screens|GuideScreen/Hero', module)
  .addParameters({ component: Hero })
  .add('default', () => <Hero {...props} />)
  .add('with contributor count', () => <Hero {...props} contributorCount="34+" />);
