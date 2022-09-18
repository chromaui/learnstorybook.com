import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@storybook/design-system';
import { Link as RawGatsbyLink } from 'gatsby';

function GatsbyLink(props) {
  return <Link LinkWrapper={RawGatsbyLink} {...props} />;
}

export default GatsbyLink;

export const GatsbyLinkWrapper = React.forwardRef(
  (
    // eslint-disable-next-line react/prop-types, no-unused-vars
    { href, appearance, containsIcon, disabled, inverse, isLoading, ...props },
    ref
  ) => <RawGatsbyLink to={href} ref={ref} {...props} />
);
GatsbyLinkWrapper.propTypes = {
  href: PropTypes.string.isRequired,
};
GatsbyLinkWrapper.displayName = 'GatsbyLinkWrapper';
