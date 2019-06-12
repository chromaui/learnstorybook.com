import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import GitHubButton from 'react-github-button';
import 'react-github-button/assets/style.css';
import { styles, WithTooltip } from '@storybook/design-system';
import GatsbyLink from '../atoms/GatsbyLink';
import Logo from '../atoms/Logo';

const { color, spacing, pageMargins, breakpoint, typography } = styles;

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
  height: 3rem;
  vertical-align: top;
  align-items: center;
  font-size: ${typography.size.s2}px;
  font-weight: ${typography.weight.bold};
  line-height: 19px;
  color: ${props => props.isInverted ? color.lightest : color.darkest};

  ${props => props.showDesktop && `
    display: none;
    @media (min-width: ${breakpoint}px) {
      display: inline-flex;
    }
  `}

  ${props => props.showMobile && `
    @media (min-width: ${breakpoint}px) {
      display: none;
    }
  `}
`;

const NavGroup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

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

const TooltipList = styled.div`
  width: 300px;
  border-radius: 4px;
  overflow: hidden;
`;

const TooltipItem = styled.div`
  padding: 15px;

  &:not(:first-child) {
    border-top: 1px solid ${color.mediumlight};
  }
`;

const TooltipLink = styled(GatsbyLink)`
  && {
    width: 100%;
    transition: background 150ms ease-out;
  }

  &&,
  &&:hover {
    transform: none;
  }

  &&:hover {
    background: #e3f3ff;
  }
`;

const TooltipTitle = styled.div`
  font-weight: ${typography.weight.bold};
  font-size: ${typography.size.s1}px;
  color: ${color.darkest};
  line-height: 14px;
`;

const TooltipDetail = styled.div`
  font-size: ${typography.size.s1}px;
  color: ${color.dark};
  line-height: 14px;
`;

export default function Header({ guides, githubUrl, isInverted, ...props }) {
  const [namespace, repo] = githubUrl.match(/github.com\/(.*)\/(.*)$/).slice(1);
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
            <WithTooltip
              placement="bottom"
              trigger="click"
              closeOnClick
              tooltip={
                <TooltipList>
                  {guides.edges.map(({ node: guideNode }) => (
                    <Fragment key={guideNode.fields.slug}>
                      <TooltipLink to={guideNode.fields.slug}>
                        <TooltipItem>
                          <TooltipTitle>{guideNode.frontmatter.title}</TooltipTitle>
                          <TooltipDetail>{guideNode.frontmatter.description}</TooltipDetail>
                        </TooltipItem>
                      </TooltipLink>
                    </Fragment>
                  ))}
                </TooltipList>
              }
            >
              Guides
            </WithTooltip>
          </NavItem>

          <NavItem isInverted={isInverted}>
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
