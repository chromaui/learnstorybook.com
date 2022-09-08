import React from 'react';
import ShadowBox from './ShadowBox';

export default {
  component: ShadowBox,
  title: 'Basics/ShadowBox',
};

function Story(args) {
  return <ShadowBox {...args} />;
}
export const Default = Story.bind({});
Default.args = {
  children: 'Shadow box content',
};
