import React from 'react';
import { storiesOf } from '@storybook/react';
import { PureCommunity } from './Community';

const contributors = [...Array(30)].map((_, index) => ({
  id: `id-${index}`,
  avatar_url: 'https://avatars2.githubusercontent.com/u/263385',
}));

storiesOf('Screens|IndexScreen/Community', module).add('default', () => (
  <PureCommunity contributors={contributors} />
));
