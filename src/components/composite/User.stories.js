import React from 'react';
import { storiesOf } from '@storybook/react';
import User from './User';

storiesOf('Molecules|User', module).add('default', () => (
  <User
    src="https://avatars2.githubusercontent.com/u/263385"
    name="Dominic Nguyen"
    detail="Professional rapper"
  />
));
