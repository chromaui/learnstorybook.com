import React from 'react';
import ShadowBox from './ShadowBox';

export default {
  component: ShadowBox,
  title: 'Basics/ShadowBox',
};

export const Basic = () => <ShadowBox>Shadow box content</ShadowBox>;
Basic.storyName = 'default';
