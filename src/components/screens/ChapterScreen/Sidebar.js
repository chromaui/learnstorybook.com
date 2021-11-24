import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
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
    padding-bottom: 1.5rem;
  }
`;

const GuideLink = styled(GatsbyLink)`
  && {
    color: ${color.dark};
    font-weight: ${typography.weight.black};
    line-height: 20px;
    margin-bottom: 12px;
    @media (min-width: ${breakpoint * 1}px) {
      width: 200px;
    }
  }
`;

const SidebarBackIcon = styled((props) => <Icon {...props} icon="arrowleft" />)`
  && {
    width: 1em;
    margin-left: -1.6em;
    margin-right: 0.6em;
    color: ${color.medium};
  }
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
    <StickyWrapper>
      <GuideLink tertiary to={`/${guide}`} title={`Back to ${guideTitle}`}>
        <SidebarBackIcon icon="arrowleft" />
        {guideTitle}
      </GuideLink>

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
