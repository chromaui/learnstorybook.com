import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, styles } from '@storybook/design-system';
import GatsbyLink from '../../basics/GatsbyLink';
import TableOfContents from './TableOfContents';
import LanguageMenu from './LanguageMenu';

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
    color: ${color.dark};
    font-size: ${typography.size.s2}px;
    line-height: 20px;
    margin-bottom: 12px;
  }
`;

const SidebarBackIcon = styled(Icon).attrs({ icon: 'arrowleft' })`
  && {
    width: 12px;
    margin-left: -12px;
  }
`;

const TableOfContentsWrapper = styled(TableOfContents)`
  margin-top: 20px;
`;

const Sidebar = ({
  chapter,
  contributeUrl,
  entries,
  firstChapter,
  framework,
  guide,
  guideTitle,
  language,
  slug,
  translationPages,
}) => (
  <SidebarWrapper>
    <GuideLink tertiary to={`/${guide}`} title={`Back to ${guideTitle}`}>
      <SidebarBackIcon icon="arrowleft" />
      Back
    </GuideLink>

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

    <TableOfContentsWrapper entries={entries} currentPageSlug={slug} />
  </SidebarWrapper>
);

Sidebar.propTypes = {
  chapter: PropTypes.string.isRequired,
  contributeUrl: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
  firstChapter: PropTypes.string.isRequired,
  framework: PropTypes.string,
  guide: PropTypes.string.isRequired,
  guideTitle: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  translationPages: PropTypes.shape({
    edges: PropTypes.arrayOf(PropTypes.any).isRequired,
  }).isRequired,
};

Sidebar.defaultProps = {
  framework: PropTypes.string,
};

export default Sidebar;
