import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import { Link as DefaultLink } from '@storybook/design-system';

function Link({ isGatsby, ...props }) {
  if (isGatsby) {
    return <DefaultLink LinkWrapper={GatsbyLink} {...props} />;
  }
  return <DefaultLink {...props} />;
}

Link.propTypes = {
  isGatsby: PropTypes.bool,
  children: PropTypes.node,
};

Link.defaultProps = {
  isGatsby: false,
  children: null,
};

export default Link;
