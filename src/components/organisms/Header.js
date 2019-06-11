import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import GitHubButton from 'react-github-button';
import 'react-github-button/assets/style.css';
import { Link, styles } from '@storybook/design-system';
import GatsbyLink from '../atoms/GatsbyLink';
import Logo from '../atoms/Logo';

const { spacing, pageMargins, breakpoint } = styles;

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

export default function Header({ githubUrl, isInverted, ...props }) {
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
};

Header.defaultProps = {
  githubUrl: null,
  isInverted: false,
};
