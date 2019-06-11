import React from 'react';
import { storiesOf } from '@storybook/react';
import Hero from './Hero';

const description =
  "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.";

storiesOf('Molecules|Hero', module).add('default', () => (
  <Hero themeColor="purple" title="Visual Testing Handbook" description={description} />
));
