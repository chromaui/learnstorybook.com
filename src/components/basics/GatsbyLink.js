import React from 'react';
import { Link } from '@storybook/design-system';
import { Link as GatsbyLinkWrapper } from 'gatsby';

const GatsbyLink = props => <Link LinkWrapper={GatsbyLinkWrapper} {...props} />;

export default GatsbyLink;
