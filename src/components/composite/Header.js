import React from 'react';
import { styled } from '@storybook/theming';
import PropTypes from 'prop-types';
import GitHubButton from 'react-github-button';
import 'react-github-button/assets/style.css';
import {
  styles,
  Icon,
  TooltipLinkList,
  WithTooltip,
  Header as DSHeader,
  NavItem,
  NavLink,
} from '@storybook/design-system';
import { Link as GatsbyLink } from 'gatsby';
import LogoStorybook from '../basics/LogoStorybook';

const { breakpoint } = styles;

const LinkWrapper = ({ href, isGatsby, ...props }) => {
  if (isGatsby) {
    return <GatsbyLink to={href} {...props} />;
  }

  // eslint-disable-next-line
  return <a href={href} {...props} />;
};

LinkWrapper.propTypes = {
  href: PropTypes.string.isRequired,
  isGatsby: PropTypes.bool.isRequired,
};

const navCommunityLinks = [
  {
    title: 'Get involved',
    href: 'https://storybook.js.org/community/',
    isGatsby: false,
  },
  {
    title: 'Use cases',
    href: 'https://storybook.js.org/use-cases',
    isGatsby: false,
  },
  {
    title: 'Support',
    href: 'https://storybook.js.org/support',
    isGatsby: false,
  },
  { title: 'Team', href: 'https://storybook.js.org/team', isGatsby: false },
];

const links = [
  {
    title: 'Docs',
    href: 'https://storybook.js.org/docs/react/get-started/introduction',
    isGatsby: false,
  },
  {
    title: 'Tutorials',
    href: '/',
    isGatsby: true,
  },
  {
    title: 'Releases',
    href: 'https://storybook.js.org/releases/',
    isGatsby: false,
  },
  { title: 'Addons', href: 'https://storybook.js.org/addons', isGatsby: false },
  { title: 'Blog', href: 'https://storybook.js.org/blog', isGatsby: false },
];

const HeaderWrapper = styled.header`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
`;

const Header = ({ inverse }) => (
  <HeaderWrapper>
    <DSHeader
      navBreakpoint={1.5 * breakpoint}
      inverse={inverse}
      logo={<LogoStorybook inverse={inverse} />}
      links={
        <>
          {links.map((link) => (
            <NavItem key={link.title} showDesktop>
              <NavLink LinkWrapper={LinkWrapper} href={link.href} isGatsby={link.isGatsby}>
                {link.title}
              </NavLink>
            </NavItem>
          ))}
          <NavItem showDesktop>
            <WithTooltip
              tagName="span"
              placement="bottom"
              trigger="click"
              closeOnClick
              tooltip={<TooltipLinkList links={navCommunityLinks} LinkWrapper={LinkWrapper} />}
            >
              <NavLink tertiary>
                Community <Icon icon="arrowdown" />
              </NavLink>
            </WithTooltip>
          </NavItem>
        </>
      }
      github={<GitHubButton type="stargazers" namespace="storybookjs" repo="storybook" />}
      mobileMenu={
        <TooltipLinkList
          links={[
            ...links,
            ...navCommunityLinks,
            {
              title: 'GitHub',
              href: 'https://github.com/storybookjs/storybook',
              isGatsby: false,
            },
          ]}
          LinkWrapper={LinkWrapper}
        />
      }
    />
  </HeaderWrapper>
);

Header.propTypes = {
  inverse: PropTypes.bool,
};

Header.defaultProps = {
  inverse: false,
};

export default Header;
