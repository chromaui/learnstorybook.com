import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import startCase from 'lodash/startCase';
import sortBy from 'lodash/sortBy';
import { Button, Icon, styles, TooltipMessage, WithTooltip } from '@storybook/design-system';
import GatsbyLink from '../../../basics/GatsbyLink';
import getLanguageName from '../../../../lib/getLanguageName';

const { color, typography } = styles;

const TooltipList = styled.div`
  width: 200px;
`;

const Item = styled.div`
  position: relative;
  padding-left: 22px;
  margin-bottom: -9px;

  &:not(:first-child) {
    border-top: 1px solid ${color.mediumlight};
  }

  div {
    width: auto;
  }
`;

const Image = styled.img`
  width: 1rem;
  height: 1rem;
  top: 16px;
  left: 14px;
  position: absolute;
`;

const Link = styled(GatsbyLink).attrs({ tertiary: true })`
  && {
    text-decoration: underline;
    margin-right: 10px;
    margin-bottom: 6px;
  }
`;

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

const getChapterInOtherLanguage = (
  framework,
  language,
  guide,
  currentChapter,
  firstChapter,
  translationPages
) => {
  const expectedSlug = `/${guide}/${framework}/${language}/${currentChapter}/`;
  const chapterInOtherLanguage = translationPages.edges.find(
    ({ node: { fields } }) =>
      fields.slug === `/${guide}/${framework}/${language}/${currentChapter}/`
  );

  if (chapterInOtherLanguage) {
    return expectedSlug;
  }

  return `/${guide}/${framework}/${language}/${firstChapter}/`;
};

const getTranslationPagesByFramework = translationPages =>
  translationPages.edges.reduce((acc, pageEdge) => {
    const pagesByFramework = { ...acc };
    const {
      node: {
        fields: { framework, language },
      },
    } = pageEdge;

    if (pagesByFramework[framework] && !pagesByFramework[framework][language]) {
      pagesByFramework[framework][language] = [pageEdge];
      return pagesByFramework;
    }

    if (pagesByFramework[framework] && pagesByFramework[framework][language]) {
      pagesByFramework[framework][language].push(pageEdge);
      return pagesByFramework;
    }

    pagesByFramework[framework] = { [language]: [pageEdge] };
    return pagesByFramework;
  }, {});

const FrameworkMenu = ({ chapter, firstChapter, framework, guide, language, translationPages }) => {
  const translationPagesByFramework = useMemo(
    () => getTranslationPagesByFramework(translationPages),
    [translationPages]
  );
  const frameworks = sortBy(
    Object.keys(translationPagesByFramework),
    frameworkName => frameworkName
  );
  const sharedLinkArgs = [guide, chapter, firstChapter, translationPages];

  return (
    <WithTooltip
      placement="bottom"
      trigger="click"
      closeOnClick
      tooltip={
        <TooltipList>
          {frameworks.map(translationFramework => {
            const translationLanguages = sortBy(
              Object.keys(translationPagesByFramework[translationFramework]),
              languageName => languageName
            );

            return (
              <Item key={translationFramework}>
                <Image
                  src={`/logo-${translationFramework}.svg`}
                  alt={startCase(translationFramework)}
                />

                <TooltipMessage
                  title={startCase(translationFramework)}
                  desc={
                    <>
                      {translationLanguages.map(translationLanguage => (
                        <Link
                          key={translationLanguage}
                          to={getChapterInOtherLanguage(
                            translationFramework,
                            translationLanguage,
                            ...sharedLinkArgs
                          )}
                        >
                          {getLanguageName(translationLanguage)}
                        </Link>
                      ))}
                    </>
                  }
                />
              </Item>
            );
          })}
        </TooltipList>
      }
    >
      <Button appearance="outline" size="small">
        <ButtonContent>
          {`${startCase(framework)} - ${getLanguageName(language)}`}
          <ChevronDownIcon />
        </ButtonContent>
      </Button>
    </WithTooltip>
  );
};

FrameworkMenu.propTypes = {
  chapter: PropTypes.string.isRequired,
  firstChapter: PropTypes.string.isRequired,
  framework: PropTypes.string.isRequired,
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

export default FrameworkMenu;
