import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';
import GatsbyLink from './GatsbyLink';

const boxLinkStyles = `
  && {
    display: block;
    background: #ffffff;
    border: 1px solid ${styles.color.medium};
    border-radius: 4px;
    transition: background 150ms ease-out, border 150ms ease-out, transform 150ms ease-out;

    &:hover {
      background: ${styles.color.light};
      border: 1px solid ${styles.color.mediumdark};
    }

    &:active {
      border: 1px solid ${styles.color.dark};
    }
  }
`;

const InternalBoxLink = styled(GatsbyLink)`
  ${boxLinkStyles}
`;

const ExternalBoxLink = styled(Link).attrs({ target: '_blank' })`
  ${boxLinkStyles}
`;

const BoxLink = ({ isInternal, to, ...rest }) =>
  isInternal ? <InternalBoxLink to={to} {...rest} /> : <ExternalBoxLink href={to} {...rest} />;

BoxLink.propTypes = {
  isInternal: PropTypes.bool,
  to: PropTypes.bool.isRequired,
};

BoxLink.defaultProps = {
  isInternal: false,
};

export default BoxLink;
