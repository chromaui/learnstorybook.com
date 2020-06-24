import React from 'react';
import User from './User';

export default {
  component: User,
  title: 'Composite/User',
};

export const Basic = args => <User {...args} />;
Basic.storyName = 'Default';
Basic.args = {
  src: 'https://avatars2.githubusercontent.com/u/263385',
  name: 'Dominic Nguyen',
  detail: 'Professional rapper',
};
