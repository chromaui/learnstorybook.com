import React from 'react';
import PropTypes from 'prop-types';
import GatsbyLink from 'gatsby-link';
import styled, { css } from 'styled-components';
import GitHubButton from 'react-github-button';

import 'react-github-button/assets/style.css';

import Logo from './Logo';
import Link from './Link';
import Icon from './Icon';
import { typography, spacing, pageMargins, breakpoint } from './shared/styles';

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

// prettier-ignore
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

export default function Header({ githubUrl, inverse, ...props }) {
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
          {/* TODO:
            - Hide these links on the homepage
            - Add Tooltip component to switch between view layers/languages
            - React
              - React
              - Vue
              - Add yours? (/contribute)
            - English
              - English
              - Spanish
              - Help translate (/contribute)
          */}
          <NavItem showDesktop>
            <NavLink className={inverse ? 'inverse' : 'tertiary'}>
              <Icon icon="switchalt" />
              React
            </NavLink>
          </NavItem>
          <NavItem showDesktop>
            <NavLink className={inverse ? 'inverse' : 'tertiary'}>
              <Icon icon="comment" />
              English
            </NavLink>
          </NavItem>
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
};

Header.defaultProps = {
  githubUrl: null,
  inverse: false,
};
