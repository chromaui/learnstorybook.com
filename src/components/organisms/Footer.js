import React from 'react';
import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';
import GatsbyLink from '../atoms/GatsbyLink';
import Logo from '../atoms/Logo';
import LogoChroma from '../atoms/LogoChroma';

const { background, color, typography, pageMargins } = styles;

const FooterWrapper = styled.footer`
  background: ${background.app};
  padding: 52px 0;
  display: flex;
  color: ${color.darker};
  font-size: ${typography.size.s2}px;
  line-height: 20px;
  border-top: 1px solid ${color.mediumlight};
`;

const FooterContent = styled.div`
  ${pageMargins}
`;

const FooterBlock = styled.div`
  width: auto;
`;

const FooterLogoBlock = styled.div`
  ${props => !props.isFirst && `margin-top: 38px;`}
`;

const FooterLink = styled(Link)`
  font-weight: ${typography.weight.bold};
`;

const LogoMessage = styled.div`
  margin-top: 14px;
`;

const LogoWrapper = styled(Logo)`
  && {
    height: 24px;
    width: auto;
  }
`;

const LogoChromaWrapper = styled(LogoChroma)`
  && {
    height: 26px;
    width: auto;
  }
`;

const linkProps = { target: '_blank' };

const Footer = ({ ...props }) => (
  <FooterWrapper {...props}>
    <FooterContent>
      <FooterBlock>
        <FooterLogoBlock isFirst>
          <GatsbyLink to="/">
            <LogoWrapper />
          </GatsbyLink>

          <LogoMessage>
            In depth guides written by Storybook maintainers for professional developers.
          </LogoMessage>
        </FooterLogoBlock>

        <FooterLogoBlock>
          <Link target="_blank" href="https://hichroma.com/">
            <LogoChromaWrapper />
          </Link>

          <LogoMessage>Made by Chroma and the amazing Storybook community.</LogoMessage>
        </FooterLogoBlock>
      </FooterBlock>
    </FooterContent>
  </FooterWrapper>
);

export default Footer;
