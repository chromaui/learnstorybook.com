import React from 'react'
import Link from 'gatsby-link'
import styled, { css } from 'styled-components'

import Logo from './Logo'
import { typography, spacing, pageMargins, breakpoint } from './shared/styles'

const LogoWrapper = styled(Logo)`
  height: 18px;
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
`

const AuthWrapper = styled.div`
  margin-top: 4px;
  text-align: left;
  line-height: 0;
`

const NavLink = styled(Link)`
  font-size: ${typography.size.s2}px;
  font-weight: ${typography.weight.extrabold};
`

const Menu = styled(Link)`
  width: 3rem;
  border: none !important;
  text-decoration: none !important;
  text-align: right;
  svg {
    vertical-align: top;
    height: 1rem;
    width: 1rem;
    margin: 0;
  }
`

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
`

export default function Header({ title, githubUrl, inverse, ...props }) {
  return (
    <NavWrapper {...props}>
      <Nav>
        <NavGroup>
          <NavItem>
            <NavLink to="/">
              <LogoWrapper inverse={inverse} />
            </NavLink>
          </NavItem>
        </NavGroup>
        <NavGroup right>
          <NavItem>
            <a
              className="github-button"
              href={githubUrl}
              data-size="large"
              data-show-count="true"
              aria-label="Star hichroma/learnstorybook.com on GitHub"
            >
              Star
            </a>
          </NavItem>
        </NavGroup>
      </Nav>
    </NavWrapper>
  )
}
