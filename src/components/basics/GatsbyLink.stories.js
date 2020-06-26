import React from 'react';
import GatsbyLink from './GatsbyLink';

export default {
  component: GatsbyLink,
  title: 'Basics/GatsbyLink',
};

const Story = args => <GatsbyLink {...args}>{args.text}</GatsbyLink>;
export const Default = Story.bind({});
Default.args = {
  to: '/',
  text: 'I am a GatsbyLink',
};
