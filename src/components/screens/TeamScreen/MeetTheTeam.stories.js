import React from 'react';
import { storiesOf } from '@storybook/react';
import MeetTheTeam from './MeetTheTeam';

storiesOf('Screens|TeamScreen/MeetTheTeam', module)
  .addParameters({ component: MeetTheTeam })
  .add('default', () => <MeetTheTeam />);
