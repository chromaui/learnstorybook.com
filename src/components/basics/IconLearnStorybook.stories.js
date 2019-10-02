import React from 'react';
import { storiesOf } from '@storybook/react';
import IconLearnStorybook from './IconLearnStorybook';

storiesOf('Basics|IconLearnStorybook', module)
  .addParameters({ component: IconLearnStorybook })
  .add('default', () => <IconLearnStorybook />);
