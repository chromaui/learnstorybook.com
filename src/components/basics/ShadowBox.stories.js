import React from 'react';
import { storiesOf } from '@storybook/react';
import ShadowBox from './ShadowBox';

storiesOf('Basics|ShadowBox', module).add('default', () => (
  <ShadowBox>Shadow box content</ShadowBox>
));
