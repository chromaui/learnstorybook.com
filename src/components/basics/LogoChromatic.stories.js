import React from 'react';
import { storiesOf } from '@storybook/react';
import LogoChromatic from './LogoChromatic';

storiesOf('Basics|LogoChromatic', module)
  .addParameters({ component: LogoChromatic })
  .add('default', () => <LogoChromatic />);
