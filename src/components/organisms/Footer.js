import React from 'react';

import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';

import LogoChroma from '../atoms/LogoChroma';

const { background, color, typography, pageMargins } = styles;

const FooterWrapper = styled.footer`
  background: ${background.app};
  padding: 52px 0;
  color: ${color.mediumdark};
  border-top: 1px solid ${color.mediumlight};
`;

const FooterContent = styled.div`
  ${pageMargins}
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
    <FooterContent>
      <a href="https://blog.hichroma.com" target="_blank" rel="noopener noreferrer">
        <Logo />
      </a>
      <br />
      Made by{' '}
      <FooterLink secondary href="https://blog.hichroma.com" target="_blank">
        Chroma
      </FooterLink>{' '}
      and the awesome Storybook community
    </FooterContent>
  </FooterWrapper>
);

export default Footer;
