import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { Menu, SubNavCTA } from '@storybook/components-marketing';
import { sortBy } from 'lodash';

import getLanguageName from '../../../lib/getLanguageName';
import getChapterInOtherLanguage from '../../../lib/getChapterInOtherLanguage';
import { GatsbyLinkWrapper } from '../../basics/GatsbyLink';

const getTranslationLanguages = (translationPages) =>
  translationPages.edges.reduce(
    (uniqueLanguages, pageEdge) => uniqueLanguages.add(pageEdge.node.fields.language),
    new Set()
  );

function LanguageSelector({
  chapter,
  contributeUrl,
  firstChapter,
  guide,
  language,
  translationPages,
}) {
  const translationLanguages = React.useMemo(
    () => getTranslationLanguages(translationPages),
    [translationPages]
  );

  if (translationLanguages.size < 2) {
    return (
      <SubNavCTA
        appearance="tertiary"
        size="small"
        isLink
        href={contributeUrl}
        target="_blank"
        rel="noopener"
      >
        Help us translate
      </SubNavCTA>
    );
  }

  const items = sortBy(Array.from(translationLanguages), (l) => l).map((l) => ({
    link: {
      LinkWrapper: GatsbyLinkWrapper,
      url: withPrefix(getChapterInOtherLanguage(l, guide, chapter, firstChapter, translationPages)),
    },
    label: getLanguageName(l),
  }));

  return <Menu label={getLanguageName(language)} items={items} primary />;
}

LanguageSelector.propTypes = {
  chapter: PropTypes.string.isRequired,
  contributeUrl: PropTypes.string.isRequired,
  firstChapter: PropTypes.string.isRequired,
  guide: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  translationPages: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          fields: PropTypes.shape({
            framework: PropTypes.string.isRequired,
            language: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default LanguageSelector;
