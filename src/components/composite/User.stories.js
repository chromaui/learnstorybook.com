import React from 'react';
import { storiesOf } from '@storybook/react';
import User from './User';

storiesOf('Composite|User', module)
  .addParameters({ component: User })
  .add('default', () => (
    <User
      src="https://avatars2.githubusercontent.com/u/263385"
      name="Dominic Nguyen"
      detail="Professional rapper"
    />
  ));
