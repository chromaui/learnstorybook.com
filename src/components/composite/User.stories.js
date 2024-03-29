import React from 'react';
import User from './User';

export default {
  component: User,
  title: 'Composite/User',
};

function Story(args) {
  return <User {...args} />;
}

export const Default = Story.bind({});
Default.args = {
  src: 'https://avatars2.githubusercontent.com/u/263385',
  name: 'Dominic Nguyen',
  detail: 'Professional rapper',
};
