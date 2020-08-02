import React from 'react';
import GatsbyLink from './GatsbyLink';

export default {
  component: GatsbyLink,
  title: 'Basics/GatsbyLink',
};

const Story = args => <GatsbyLink {...args} />;
export const Default = Story.bind({});
Default.args = {
  to: '/',
  children: 'I am a GatsbyLink',
};
