import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { styles } from '@storybook/design-system';
import Subheading from '../GuideScreen/SubHeading';
import TableOfContents from './TableOfContents';
import LanguageMenu from './LanguageMenu';

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

function Sidebar({
  chapter,
  contributeUrl,
  entries,
  firstChapter,
  framework,
  guide,
  language,
  slug,
  translationPages,
}) {
  return (
    <SidebarWrapper>
      <StickyWrapper>
        <StyledSubheading>Chapters</StyledSubheading>

        <TableOfContentsWrapper entries={entries} currentPageSlug={slug} />

        <div>
          <LanguageMenu
            chapter={chapter}
            contributeUrl={contributeUrl}
            guide={guide}
            firstChapter={firstChapter}
            framework={framework}
            language={language}
            translationPages={translationPages}
          />
        </div>
      </StickyWrapper>
    </SidebarWrapper>
  );
}

Sidebar.propTypes = {
  chapter: PropTypes.string.isRequired,
  contributeUrl: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
  firstChapter: PropTypes.string.isRequired,
  framework: PropTypes.string,
  guide: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  translationPages: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    edges: PropTypes.arrayOf(PropTypes.any).isRequired,
  }).isRequired,
};

Sidebar.defaultProps = {
  framework: PropTypes.string,
};

export default Sidebar;
