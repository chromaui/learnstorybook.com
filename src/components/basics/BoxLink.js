import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';
import { rgba } from 'polished';
import GatsbyLink from './GatsbyLink';

const boxLinkStyles = `
  && {
    display: block;
    background: ${styles.color.lightest};
    border: 1px solid ${styles.color.border};
    border-radius: 4px;
    transition: background 150ms ease-out, border 150ms ease-out, transform 150ms ease-out;

    &:hover {
      border-color: ${rgba(styles.color.secondary, 0.5)};
      transform: translate3d(0, -3px, 0);
      box-shadow: rgba(0, 0, 0, 0.08) 0 3px 10px 0;
    }

    &:active {
      border-color: ${rgba(styles.color.secondary, 1)};
      transform: translate3d(0, 0, 0);
    }
  }
`;

const InternalBoxLink = styled(GatsbyLink)`
  ${boxLinkStyles}
`;

const ExternalBoxLink = styled(Link).attrs({
  target: '_blank',
  rel: 'noopener',
})`
  ${boxLinkStyles}
`;

const BoxLink = ({ isInternal, to, ...rest }) =>
  isInternal ? <InternalBoxLink to={to} {...rest} /> : <ExternalBoxLink href={to} {...rest} />;

BoxLink.propTypes = {
  isInternal: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

BoxLink.defaultProps = {
  isInternal: false,
};

export default BoxLink;
