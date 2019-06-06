import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import GitHubButton from 'react-github-button';
import { Icon, Link, styles, WithTooltip } from '@storybook/design-system';

import 'react-github-button/assets/style.css';

import GatsbyLink from '../atoms/GatsbyLink';
import Logo from '../atoms/Logo';

const { color, typography, spacing, pageMargins, breakpoint } = styles;

const LogoWrapper = styled(Logo)`
  && {
    height: 28px;
    width: auto;
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

const NavLink = styled(Link)`
  font-size: ${typography.size.s3}px;
  font-weight: ${typography.weight.black};
`;

// prettier-ignore
const NavItem = styled.div`
  display: inline-flex;
  line-height: 3rem;
  height: 3rem;
  vertical-align: top;
  align-items: center;

  ${props => props.showDesktop && css`
    display: none;
    @media (min-width: ${breakpoint}px) {
      display: inline-flex;
    }
  `}

  ${props => props.showMobile && css`
    @media (min-width: ${breakpoint}px) {
      display: none;
    }
  `}
`;

// prettier-ignore
const NavGroup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  ${props => props.right && css`
    left: auto;
    right: 0;
  `}

  ${NavItem} + ${NavItem} {
    margin-left: ${spacing.padding.large}px;
  }
`;

const Nav = styled.div`
  height: 3rem;
  position: relative;
  text-align: center;
  z-index: 3;
`;

const NavWrapper = styled.nav`
  ${pageMargins};
  padding-top: 12px;
  @media (min-width: ${breakpoint}px) {
    padding-top: 36px;
  }
`;

const TooltipList = styled.div`
  width: 200px;
`;

const TooltipItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  padding: 15px 15px 5px;

  &:not(:first-child) {
    border-top: 1px solid ${color.mediumlight};
  }
`;

const ViewLayerImage = styled.img`
  width: 1rem;
  height: 1rem;
  margin-right: 8px;
`;

const Meta = styled.div``;

const Title = styled.div`
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.s2}px;
  line-height: 1;
  margin-bottom: 6px;
`;

const Detail = styled.div`
  font-size: ${typography.size.s1}px;
  line-height: 1;
`;

const LanguageLink = styled(GatsbyLink).attrs({ tertiary: true })`
  && {
    text-decoration: underline;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

const GitHubWrapper = styled.div`
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

function capitalize([first, ...rest]) {
  return [first.toUpperCase(), ...rest];
}

export default function Header({
  githubUrl,
  isInverted,
  framework,
  firstChapter,
  withNav,
  ...props
}) {
  const [namespace, repo] = githubUrl.match(/github.com\/(.*)\/(.*)$/).slice(1);
  return (
    <NavWrapper {...props}>
      <Nav>
        <NavGroup>
          <NavItem>
            <Link to="/" LinkWrapper={GatsbyLink}>
              <LogoWrapper isInverted={isInverted} />
            </Link>
          </NavItem>
        </NavGroup>
        <NavGroup right>
          {withNav && (
            <NavItem showDesktop>
              <WithTooltip
                placement="top"
                trigger="click"
                closeOnClick
                tooltip={
                  <TooltipList>
                    <TooltipItem>
                      <ViewLayerImage src="/logo-react.svg" alt="React" />
                      <Meta>
                        <Title>React</Title>
                        <Detail>
                          <LanguageLink to={`/react/en/${firstChapter}/`}>English</LanguageLink>
                          <LanguageLink to={`/react/es/${firstChapter}/`}>Español</LanguageLink>
                          <LanguageLink to={`/react/zh-CN/${firstChapter}/`}>简体中文</LanguageLink>
                          <LanguageLink to={`/react/zh-TW/${firstChapter}/`}>繁體中文</LanguageLink>
                          <LanguageLink to={`/react/pt/${firstChapter}/`}>Português</LanguageLink>
                        </Detail>
                      </Meta>
                    </TooltipItem>

                    <TooltipItem>
                      <ViewLayerImage src="/logo-angular.svg" alt="Angular" />
                      <Meta>
                        <Title>Angular</Title>
                        <Detail>
                          <LanguageLink to={`/angular/en/${firstChapter}/`}>English</LanguageLink>
                          <LanguageLink to={`/angular/es/${firstChapter}/`}>Español</LanguageLink>
                          <LanguageLink to={`/angular/pt/${firstChapter}/`}>Português</LanguageLink>
                        </Detail>
                      </Meta>
                    </TooltipItem>
                    <TooltipItem>
                      <ViewLayerImage src="/logo-vue.svg" alt="Vue" />
                      <Meta>
                        <Title>Vue</Title>
                        <Detail>
                          <LanguageLink to={`/vue/en/${firstChapter}/`}>English</LanguageLink>
                          <LanguageLink to={`/vue/pt/${firstChapter}/`}>Português</LanguageLink>
                        </Detail>
                      </Meta>
                    </TooltipItem>
                  </TooltipList>
                }
              >
                <NavLink inverse={isInverted} tertiary={!isInverted}>
                  <Icon icon="switchalt" />
                  {capitalize(framework)}
                </NavLink>
              </WithTooltip>
            </NavItem>
          )}

          <NavItem>
            <GitHubWrapper>
              <GitHubButton type="stargazers" namespace={namespace} repo={repo} />
            </GitHubWrapper>
          </NavItem>
        </NavGroup>
      </Nav>
    </NavWrapper>
  );
}

Header.propTypes = {
  githubUrl: PropTypes.string,
  isInverted: PropTypes.bool,
  framework: PropTypes.string,
  firstChapter: PropTypes.string.isRequired,
  withNav: PropTypes.bool,
};

Header.defaultProps = {
  githubUrl: null,
  isInverted: false,
  framework: 'react',
  withNav: null,
};
