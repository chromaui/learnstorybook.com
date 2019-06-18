import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import sortBy from 'lodash/sortBy';
import { Button, Icon, styles, TooltipLinkList, WithTooltip } from '@storybook/design-system';
import getLanguageName from '../../../../lib/getLanguageName';
import GatsbyLink from '../../../basics/GatsbyLink';

const { typography } = styles;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  font-weight: ${typography.weight.black};
`;

const ChevronDownIcon = styled(Icon).attrs({ icon: 'chevrondown' })`
  && {
    width: 8px;
    height: 8px;
    margin-left: 5px;
  }
`;

const TooltipList = styled.div`
  border-radius: 4px;
  overflow: hidden;
`;

const LinkWrapper = styled(GatsbyLink)`
  && {
    display: block;

    &:hover {
      transform: none;
    }
  }
`;

const TooltipLinkWrapper = props => <LinkWrapper {...props} />;

const getTranslationLanguages = translationPages =>
  translationPages.edges.reduce(
    (uniqueLanguages, pageEdge) => uniqueLanguages.add(pageEdge.node.fields.language),
    new Set()
  );

const getChapterInOtherLanguage = (
  language,
  guide,
  currentChapter,
  firstChapter,
  translationPages
) => {
  const expectedSlug = `/${guide}/${language}/${currentChapter}/`;
  const chapterInOtherLanguage = translationPages.edges.find(
    ({ node: { fields } }) => fields.slug === expectedSlug
  );

  if (chapterInOtherLanguage) {
    return expectedSlug;
  }

  return `/${guide}/${language}/${firstChapter}/`;
};

const NonFrameworkMenu = ({ chapter, firstChapter, guide, language, translationPages }) => {
  const translationLanguages = useMemo(() => getTranslationLanguages(translationPages), [
    translationPages,
  ]);
  const sortedLanguages = sortBy(Array.from(translationLanguages), languageName => languageName);

  return (
    <WithTooltip
      placement="bottom"
      trigger="click"
      closeOnClick
      tooltip={
        <TooltipList>
          <TooltipLinkList
            links={sortedLanguages.map(translationLanguage => ({
              title: getLanguageName(translationLanguage),
              href: getChapterInOtherLanguage(
                translationLanguage,
                guide,
                chapter,
                firstChapter,
                translationPages
              ),
            }))}
            LinkWrapper={TooltipLinkWrapper}
          />
        </TooltipList>
      }
    >
      <Button appearance="outline" size="small">
        <ButtonContent>
          {getLanguageName(language)}
          <ChevronDownIcon />
        </ButtonContent>
      </Button>
    </WithTooltip>
  );
};

NonFrameworkMenu.propTypes = {
  chapter: PropTypes.string.isRequired,
  firstChapter: PropTypes.string.isRequired,
  guide: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  translationPages: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          fields: PropTypes.shape({
            language: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default NonFrameworkMenu;
