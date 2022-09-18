import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { styles } from '@storybook/design-system';
import Subheading from '../GuideScreen/SubHeading';
import TableOfContents from './TableOfContents';

const { breakpoint, color } = styles;

const SidebarWrapper = styled.div`
  flex: 0 1 240px;
  padding-right: 20px;

  @media (max-width: ${breakpoint - 1}px) {
    flex: none;
    margin: 1rem 0 2rem;
    width: 100%;
    border-bottom: 1px solid ${color.mediumlight};
    padding-bottom: 1.5rem;
  }
`;

const StyledSubheading = styled(Subheading)`
  margin-top: 0;
`;

const TableOfContentsWrapper = styled(TableOfContents)`
  @media (min-width: ${breakpoint * 1}px) {
    margin-bottom: 3rem;
  }
`;

const StickyWrapper = styled.div`
  position: sticky;
  top: 3rem;
`;

function Sidebar({ entries, slug }) {
  return (
    <SidebarWrapper>
      <StickyWrapper>
        <StyledSubheading>Chapters</StyledSubheading>
        <TableOfContentsWrapper entries={entries} currentPageSlug={slug} />
      </StickyWrapper>
    </SidebarWrapper>
  );
}

Sidebar.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
  slug: PropTypes.string.isRequired,
};

export default Sidebar;
