import React from 'react';
import { storiesOf } from '@storybook/react';
import LogoChroma from './LogoChroma';

storiesOf('Basics|LogoChroma', module)
  .addParameters({ component: LogoChroma })
  .add('default', () => <LogoChroma />);
