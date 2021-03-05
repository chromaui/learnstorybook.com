import React from 'react';
import { PureCommunity } from './Community';

export default {
  component: PureCommunity,
  title: 'Screens/IndexScreen/Community',
};

const Story = args => <PureCommunity {...args} />;
export const Default = Story.bind({});
Default.args = {
  contributors: [...Array(30)].map((_, index) => ({
    id: index,
    avatar_url: 'https://avatars2.githubusercontent.com/u/263385',
  })),
};
