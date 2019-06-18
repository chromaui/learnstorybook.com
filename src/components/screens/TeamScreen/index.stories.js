import React from 'react';
import { storiesOf } from '@storybook/react';
import TeamScreen from './index';

storiesOf('Screens|TeamScreen/index', module)
  .addParameters({ component: TeamScreen })
  .add('default', () => <TeamScreen />);
