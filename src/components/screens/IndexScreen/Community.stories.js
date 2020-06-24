import React from 'react';
import { PureCommunity } from './Community';

export default {
  component: PureCommunity,
  excludeStories: /.*Data$/,
  title: 'Screens/IndexScreen/Community',
};
const contributorsData = [...Array(30)].map((_, index) => ({
  id: index,
  avatar_url: 'https://avatars2.githubusercontent.com/u/263385',
}));

export const Basic = () => <PureCommunity contributors={contributorsData} />;
Basic.storyName = 'default';
