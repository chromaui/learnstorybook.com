import React from 'react';
import { Link } from '@storybook/design-system';
import { Link as GatsbyLinkWrapper } from 'gatsby';

function GatsbyLink(props) {
  return <Link LinkWrapper={GatsbyLinkWrapper} {...props} />;
}

export default GatsbyLink;
