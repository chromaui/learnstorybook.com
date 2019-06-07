import React from 'react';
import styled from 'styled-components';
import { Link, styles, Subheading } from '@storybook/design-system';
import GatsbyLink from '../atoms/GatsbyLink';
import Logo from '../atoms/Logo';
import LogoChroma from '../atoms/LogoChroma';
import MailingListSignup from '../molecules/MailingListSignup';

const { background, color, typography, pageMargins, spacing } = styles;

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
  display: flex;
`;

const FooterBlock = styled.div`
  width: auto;
  ${props =>
    props.withRightSpacing &&
    `
    margin-right: ${spacing.padding.medium}px;
  `}
`;

const FooterLogoBlock = styled.div`
  ${props => !props.isFirst && `margin-top: 38px;`}
`;

const Message = styled.div`
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

const SubheadingWrapper = styled(Subheading)`
  color: ${color.mediumdark};
`;

const MailingListSignupWrapper = styled(MailingListSignup)`
  margin-top: 16px;
`;

const Footer = ({ ...props }) => (
  <FooterWrapper {...props}>
    <FooterContent>
      <FooterBlock withRightSpacing>
        <FooterLogoBlock isFirst>
          <GatsbyLink to="/">
            <LogoWrapper />
          </GatsbyLink>

          <Message>
            In depth guides written by Storybook maintainers for professional developers.
          </Message>
        </FooterLogoBlock>

        <FooterLogoBlock>
          <Link target="_blank" href="https://hichroma.com/">
            <LogoChromaWrapper />
          </Link>

          <Message>Made by Chroma and the amazing Storybook community.</Message>
        </FooterLogoBlock>
      </FooterBlock>

      <FooterBlock>
        <SubheadingWrapper>Subscribe</SubheadingWrapper>

        <Message>
          Join the Chroma mailing list to get free tutorials, guides, and resources emailed to you.
        </Message>

        <MailingListSignupWrapper />
      </FooterBlock>
    </FooterContent>
  </FooterWrapper>
);

export default Footer;
