import React from 'react';
import { storiesOf } from '@storybook/react';
import Pitch from './Pitch';

storiesOf('Screens|IndexScreen/Pitch', module)
  .addParameters({ component: Pitch })
  .add('default', () => <Pitch />);
