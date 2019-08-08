import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import styled, { css } from 'styled-components';
import GitHubButton from 'react-github-button';

import 'react-github-button/assets/style.css';

import Logo from './Logo';
import Link from './Link';
import Icon from './Icon';
import WithTooltip from './WithTooltip';
import { color, typography, spacing, pageMargins, breakpoint } from './shared/styles';

const LogoWrapper = styled(Logo)`
  height: 20px;
  width: auto;

  @media (min-width: ${breakpoint}px) {
    height: 22px;
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
`;

const NavLink = styled(Link)`
  font-size: ${typography.size.s3}px;
  font-weight: ${typography.weight.extrabold};
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
  font-weight: ${typography.weight.extrabold};
  font-size: ${typography.size.s2}px;
  line-height: 1;
  margin-bottom: 6px;
`;

const Detail = styled.div`
  font-size: ${typography.size.s1}px;
  line-height: 1;
`;

const LanguageLink = styled(Link)`
  text-decoration: underline;
  margin-right: 10px;
  margin-bottom: 10px;
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

export default function Header({ githubUrl, inverse, framework, firstChapter, isHome, ...props }) {
  const [namespace, repo] = githubUrl.match(/github.com\/(.*)\/(.*)$/).slice(1);
  return (
    <NavWrapper {...props}>
      <Nav>
        <NavGroup>
          <NavItem>
            <GatsbyLink to="/">
              <LogoWrapper inverse={inverse} />
            </GatsbyLink>
          </NavItem>
        </NavGroup>
        <NavGroup right>
          {!isHome && (
            <NavItem showDesktop>
              <WithTooltip
                placement="top"
                mode="click"
                closeOnClick
                tooltip={
                  <TooltipList>
                    <TooltipItem>
                      <ViewLayerImage src="/logo-react.svg" alt="React" />
                      <Meta>
                        <Title>React</Title>
                        <Detail>
                          <LanguageLink isGatsby tertiary to={`/react/en/${firstChapter}/`}>
                            English
                          </LanguageLink>
                          <LanguageLink isGatsby tertiary to={`/react/es/${firstChapter}/`}>
                            Español
                          </LanguageLink>
                          <LanguageLink isGatsby tertiary to={`/react/zh-CN/${firstChapter}/`}>
                            简体中文
                          </LanguageLink>
                          <LanguageLink isGatsby tertiary to={`/react/zh-TW/${firstChapter}/`}>
                            繁體中文
                          </LanguageLink>
                          <LanguageLink isGatsby tertiary to={`/react/pt/${firstChapter}/`}>
                            Português
                          </LanguageLink>
                        </Detail>
                      </Meta>
                    </TooltipItem>

                    <TooltipItem>
                      <ViewLayerImage src="/logo-angular.svg" alt="Angular" />
                      <Meta>
                        <Title>Angular</Title>
                        <Detail>
                          <LanguageLink isGatsby tertiary to={`/angular/en/${firstChapter}/`}>
                            English
                          </LanguageLink>
                          <LanguageLink isGatsby tertiary to={`/angular/es/${firstChapter}/`}>
                            Español
                          </LanguageLink>
                          <LanguageLink isGatsby tertiary to={`/angular/pt/${firstChapter}/`}>
                            Português
                          </LanguageLink>
                        </Detail>
                      </Meta>
                    </TooltipItem>
                    <TooltipItem>
                      <ViewLayerImage src="/logo-vue.svg" alt="Vue" />
                      <Meta>
                        <Title>Vue</Title>
                        <Detail>
                          <LanguageLink isGatsby tertiary to={`/vue/en/${firstChapter}/`}>
                            English
                          </LanguageLink>
                          <LanguageLink isGatsby tertiary to={`/vue/pt/${firstChapter}/`}>
                            Português
                          </LanguageLink>
                        </Detail>
                      </Meta>
                    </TooltipItem>
                  </TooltipList>
                }
              >
                <NavLink tertiary={!inverse}>
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
  inverse: PropTypes.bool,
  framework: PropTypes.string,
  firstChapter: PropTypes.string.isRequired,
  isHome: PropTypes.bool,
};

Header.defaultProps = {
  githubUrl: null,
  inverse: false,
  framework: 'react',
  isHome: null,
};
