import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';
import storybookLogo from '../../../static/storybook-logo.svg';
import storybookLogoInverted from '../../../static/storybook-logo-inverted.svg';
// eslint-disable-next-line
import siteMetadata from '../../../site-metadata';

const { typography, color, breakpoint } = styles;

const LogoWrapper = styled.div`
  display: inline-block;
  align-self: stretch;
`;

const LogotypeWrapper = styled(Link)`
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

const Version = styled(Link)`
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
  position: relative;
  top: 2px;
  font-size: ${typography.size.s1}px;
  color: ${props => (props.inverse ? color.lightest : color.mediumdark)};
`;

const LogoStorybook = ({ inverse }) => (
  <LogoWrapper>
    <LogotypeWrapper href="https://storybook.js.org/">
      <img src={inverse ? storybookLogoInverted : storybookLogo} alt="Storybook" />
    </LogotypeWrapper>
    <Version href="https://github.com/storybookjs/storybook/releases" inverse={inverse}>
      {siteMetadata.latestVersion}
    </Version>
  </LogoWrapper>
);

LogoStorybook.propTypes = {
  inverse: PropTypes.bool,
};

LogoStorybook.defaultProps = {
  inverse: false,
};

export default LogoStorybook;
