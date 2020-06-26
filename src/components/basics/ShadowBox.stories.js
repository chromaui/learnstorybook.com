import React from 'react';
import ShadowBox from './ShadowBox';

export default {
  component: ShadowBox,
  title: 'Basics/ShadowBox',
};

const Story = args => <ShadowBox {...args}>{args.text}</ShadowBox>;
export const Default = Story.bind({});
Default.args = {
  text: 'Shadow box content',
};
