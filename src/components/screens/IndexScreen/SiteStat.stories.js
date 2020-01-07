import React from 'react';
import SiteStat from './SiteStat';

export default {
  component: SiteStat,
  title: 'Screens|IndexScreen/SiteStat',
};

export const Default = () => (
  <SiteStat
    heading="6 guides"
    message="Professional walkthroughs made for frontend devs. Updated all the time."
  />
);
