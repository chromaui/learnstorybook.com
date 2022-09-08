import React from 'react';
import GatsbyLink from './GatsbyLink';

export default {
  component: GatsbyLink,
  title: 'Basics/GatsbyLink',
};

function Story(args) {
  return <GatsbyLink {...args} />;
}
export const Default = Story.bind({});
Default.args = {
  to: '/',
  children: 'I am a GatsbyLink',
};
