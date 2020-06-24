import React from 'react';
import { PureCommunity } from './Community';

export default {
  component: PureCommunity,
  title: 'Screens/IndexScreen/Community',
};

export const Basic = args => <PureCommunity {...args} />;
Basic.storyName = 'default';
Basic.args = {
  contributors: [...Array(30)].map((_, index) => ({
    id: index,
    avatar_url: 'https://avatars2.githubusercontent.com/u/263385',
  })),
};
