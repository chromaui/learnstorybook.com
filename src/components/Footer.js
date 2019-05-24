import React from 'react';

import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';

import LogoChroma from './LogoChroma';

const { color, typography, pageMargins } = styles;

const FooterWrapper = styled.footer`
  ${pageMargins};
  text-align: center;
  padding: 3rem 0;
  color: ${color.mediumdark};
`;

const FooterLink = styled(Link)`
  font-weight: ${typography.weight.bold};
`;

const Logo = styled(LogoChroma)`
  height: 26px;
  width: auto;
  margin-bottom: 1rem;
`;

const Footer = ({ ...props }) => (
  <FooterWrapper {...props}>
    <a href="https://blog.hichroma.com" target="_blank" rel="noopener noreferrer">
      <Logo />
    </a>
    <br />
    Made by{' '}
    <FooterLink secondary href="https://blog.hichroma.com" target="_blank">
      Chroma
    </FooterLink>{' '}
    and the awesome Storybook community
  </FooterWrapper>
);

export default Footer;
