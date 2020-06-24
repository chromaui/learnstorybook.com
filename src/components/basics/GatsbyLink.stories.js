import React from 'react';
import GatsbyLink from './GatsbyLink';

export default {
  component: GatsbyLink,
  title: 'Basics/GatsbyLink',
};

export const Basic = () => <GatsbyLink to="/">I am a GatsbyLink</GatsbyLink>;
Basic.storyName = 'Default';
