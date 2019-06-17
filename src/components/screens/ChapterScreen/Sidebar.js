import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, styles } from '@storybook/design-system';
import startCase from 'lodash/startCase';
import GatsbyLink from '../../basics/GatsbyLink';
import TableOfContents from './TableOfContents';

const { breakpoint, color, typography } = styles;

const SidebarWrapper = styled.div`
  flex: 0 1 240px;
  padding-right: 20px;

  @media (max-width: ${breakpoint - 1}px) {
    flex: none;
    margin: 1rem 0 2rem;
    width: 100%;
    border-bottom: 1px solid ${color.mediumlight};
  }
`;

const GuideLink = styled(GatsbyLink)`
  && {
    color: ${color.darkest};
    font-size: ${typography.size.s3};
    font-weight: ${typography.weight.bold};
    letter-spacing: -0.14px;
    line-height: 20px;
    margin-bottom: 12px;
  }
`;

const SidebarBackIcon = styled(Icon).attrs({ icon: 'arrowleft' })`
  && {
    width: 14px;
  }
`;

const TableOfContentsWrapper = styled(TableOfContents)`
  margin-top: 20px;
`;

const Sidebar = ({ entries, guide, languageMenu, slug }) => (
  <SidebarWrapper>
    <GuideLink tertiary to={`/${guide}`}>
      <SidebarBackIcon icon="arrowleft" />
      {startCase(guide)}
    </GuideLink>

    <div>{languageMenu}</div>

    <TableOfContentsWrapper entries={entries} currentPageSlug={slug} />
  </SidebarWrapper>
);

Sidebar.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
  guide: PropTypes.string.isRequired,
  languageMenu: PropTypes.node,
  slug: PropTypes.string.isRequired,
};

Sidebar.defaultProps = {
  languageMenu: null,
};

export default Sidebar;
