import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link as GatsbyLinkWithoutEffects } from 'gatsby';
import GitHubButton from 'react-github-button';
import 'react-github-button/assets/style.css';
import {
  Icon,
  Link,
  styles,
  Subheading,
  TooltipLinkList,
  WithTooltip,
} from '@storybook/design-system';
import GatsbyLink from '../basics/GatsbyLink';
import Logo from '../basics/Logo';

const { color, spacing, pageMargins, breakpoint, typography } = styles;

const LogoWrapper = styled(Logo)`
  && {
    height: 22px;
    width: auto;
    display: block;
    transition: transform 150ms ease-out;
    transform: translate3d(0, 0, 0);
    margin-top: -6px;

    &:hover {
      transform: translate3d(0, -1px, 0);
    }

    &:active {
      transform: translate3d(0, 0, 0);
    }

    @media (min-width: ${breakpoint}px) {
      height: 28px;
    }
  }
`;

const navBreakpoint = breakpoint * 1.2;
// prettier-ignore
const NavItem = styled.div`
  display: inline-flex;
  height: 3rem;
  vertical-align: top;
  align-items: center;
  font-size: ${typography.size.s2}px;
  font-weight: ${typography.weight.bold};
  line-height: 19px;

  ${props => props.showDesktop && `
    display: none;
    @media (min-width: ${navBreakpoint}px) {
      display: inline-flex;
    }
  `}

  ${props => props.showMobile && `
    @media (min-width: ${navBreakpoint}px) {
      display: none;
    }
  `}
`;

const NavTextLinkInternal = styled(GatsbyLink)`
  && {
    color: ${props => (props.inverse ? color.lightest : color.darkest)};

    svg {
      margin-right: 0;

      path {
        fill: ${props => (props.inverse ? color.lightest : color.darkest)};
      }
    }
  }
`;

const NavTextLinkExternal = styled(Link)`
  color: ${props => (props.inverse ? color.lightest : color.darkest)};
  transition: transform 150ms ease-out;
`;

const NavGroup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;

  ${props =>
    props.withRightAlignment &&
    `
    left: auto;
    right: 0;
  `}

  ${NavItem} + ${NavItem} {
    margin-left: ${spacing.padding.large}px;
  }
`;

const MobileMenuNavItem = styled(NavItem)`
  order: 1;
  margin-right: 10px;
`;

const GithubNavItem = styled(NavItem)`
  width: 109px;
`;

const Nav = styled.div`
  height: 3rem;
  position: relative;
  text-align: center;
  z-index: 3;
`;

const NavWrapper = styled.nav`
  ${pageMargins}
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  padding-top: 12px;

  @media (min-width: ${breakpoint}px) {
    padding-top: 36px;
  }
`;

const GitHubWrapper = styled.div`
  transform: scale(0.84);

  ${'' /* Overrides to make a medium sized button */};
  .github-btn {
    font: bold 14px/14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
    height: auto;
    .gh-btn,
    .gh-count {
      padding: 4px 8px;
    }
  }
`;

const TooltipList = styled.div`
  border-radius: 4px;
  overflow: hidden;

  @media (min-width: ${navBreakpoint}px) {
    width: 302px;
  }
`;

const TooltipLinkListWrapper = styled.div`
  padding: 8px 5px;
  color: ${color.darkest};
  white-space: normal;
`;

const TooltipLinkListSubtitle = styled.span`
  font-weight: ${typography.weight.regular};
  line-height: 1rem;
  color: ${color.dark};
  display: block;
`;

const MenuHeading = styled(Subheading)`
  color: #8c9baa;
  font-size: 10px;
  line-height: 32px;
  padding: 0px 15px;
  border-bottom: 1px solid #eeeeee;
  display: block;
`;

const MobileMenuColumn = styled.div`
  &:first-child {
    background: ${color.lightest};
  }
  &:last-child {
    background: #f8f8fa;
  }
`;

const MobileMenu = styled.div`
  font-size: ${typography.size.s1}px;
  display: flex;
  flex-direction: row;
  width: 360px;
  ${MobileMenuColumn} {
    flex: 1;
  }
  ${TooltipLinkListWrapper} {
    padding: 5px 0;
  }
`;

const TooltipLinkListLinkWrapper = ({ isExternal, to, ...rest }) => {
  if (isExternal) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a {...rest} href={to} />;
  }

  return <GatsbyLinkWithoutEffects {...rest} to={to} />;
};

TooltipLinkListLinkWrapper.propTypes = {
  isExternal: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

TooltipLinkListLinkWrapper.defaultProps = {
  isExternal: false,
};

const preventDefault = e => e.preventDefault();

export default function Header({ guides, githubUrl, isInverted, ...props }) {
  const [namespace, repo] = githubUrl.match(/github.com\/(.*)\/(.*)$/).slice(1);

  const guideList = (
    <TooltipList>
      <TooltipLinkList
        links={guides.edges.map(({ node: guideNode }) => ({
          title: (
            <TooltipLinkListWrapper>
              {guideNode.frontmatter.title}
              <TooltipLinkListSubtitle>{guideNode.frontmatter.description}</TooltipLinkListSubtitle>
            </TooltipLinkListWrapper>
          ),
          href: guideNode.fields.slug,
        }))}
        LinkWrapper={TooltipLinkListLinkWrapper}
      />
    </TooltipList>
  );

  const mobileMenu = (
    <MobileMenu>
      <MobileMenuColumn>
        <MenuHeading>Guides</MenuHeading>
        {guideList}
      </MobileMenuColumn>

      <MobileMenuColumn>
        <MenuHeading>Links</MenuHeading>

        <TooltipLinkList
          links={[
            { title: 'Team', href: '/team' },
            {
              title: 'Storybook',
              href: 'https://storybook.js.org/',
              target: '_blank',
              rel: 'noopener',
              isExternal: true,
            },
          ]}
          LinkWrapper={TooltipLinkListLinkWrapper}
        />
      </MobileMenuColumn>
    </MobileMenu>
  );

  return (
    <NavWrapper {...props}>
      <Nav>
        <NavGroup>
          <NavItem isInverted={isInverted}>
            <GatsbyLink to="/">
              <LogoWrapper isInverted={isInverted} />
            </GatsbyLink>
          </NavItem>
        </NavGroup>

        <NavGroup withRightAlignment>
          <NavItem isInverted={isInverted} showDesktop>
            <WithTooltip placement="bottom" trigger="click" closeOnClick tooltip={guideList}>
              <NavTextLinkExternal inverse={isInverted} tertiary onClick={preventDefault}>
                Guides
              </NavTextLinkExternal>
            </WithTooltip>
          </NavItem>

          <NavItem isInverted={isInverted} showDesktop>
            <NavTextLinkInternal tertiary inverse={isInverted} to="/team">
              Team
            </NavTextLinkInternal>
          </NavItem>

          <NavItem isInverted={isInverted} showDesktop>
            <NavTextLinkExternal
              tertiary
              inverse={isInverted}
              href="https://storybook.js.org/"
              target="_blank"
              rel="noopener"
            >
              Storybook
            </NavTextLinkExternal>
          </NavItem>

          <MobileMenuNavItem showMobile>
            <WithTooltip placement="top" trigger="click" tooltip={mobileMenu} closeOnClick>
              <NavTextLinkExternal tertiary inverse={isInverted} onClick={preventDefault}>
                <Icon icon="menu" />
              </NavTextLinkExternal>
            </WithTooltip>
          </MobileMenuNavItem>

          <GithubNavItem isInverted={isInverted}>
            <GitHubWrapper>
              <GitHubButton type="stargazers" namespace={namespace} repo={repo} />
            </GitHubWrapper>
          </GithubNavItem>
        </NavGroup>
      </Nav>
    </NavWrapper>
  );
}

Header.propTypes = {
  githubUrl: PropTypes.string,
  guides: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
          }).isRequired,
          fields: PropTypes.shape({
            slug: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired
    ),
  }).isRequired,
  isInverted: PropTypes.bool,
};

Header.defaultProps = {
  githubUrl: null,
  isInverted: false,
};
