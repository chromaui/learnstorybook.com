import React from 'react';
import SiteStat from './SiteStat';

export default {
  component: SiteStat,
  title: 'Screens/IndexScreen/SiteStat',
};

export const Basic = args => <SiteStat {...args} />;

Basic.storyName = 'default';
Basic.args = {
  heading: '6 guides',
  message: 'Professional walkthroughs made for frontend devs. Updated all the time.',
};
