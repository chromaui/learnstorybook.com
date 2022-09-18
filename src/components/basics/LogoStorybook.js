import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Link, styles } from '@storybook/design-system';
import storybookLogo from '../../../static/storybook-logo.svg';
import storybookLogoInverted from '../../../static/storybook-logo-inverted.svg';

const { breakpoint } = styles;

const LogotypeWrapper = styled(Link)`
  align-self: stretch;
  display: inline-block;

  img {
    height: 22px;
    width: auto;
    margin-top: 14px;
    @media (min-width: ${breakpoint}px) {
      height: 26px;
      margin-top: 10px;
    }
    display: block;
    transition: all 150ms ease-out;
    transform: translate3d(0, 0, 0);
    &:hover {
      transform: translate3d(0, -1px, 0);
    }
    &:active {
      transform: translate3d(0, 0, 0);
    }
  }
`;

function LogoStorybook({ inverse }) {
  return (
    <LogotypeWrapper href="https://storybook.js.org/">
      <img src={inverse ? storybookLogoInverted : storybookLogo} alt="Storybook" />
    </LogotypeWrapper>
  );
}

LogoStorybook.propTypes = {
  inverse: PropTypes.bool,
};

LogoStorybook.defaultProps = {
  inverse: false,
};

export default LogoStorybook;
