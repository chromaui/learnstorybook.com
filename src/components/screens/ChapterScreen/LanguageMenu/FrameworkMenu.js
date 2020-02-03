import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import startCase from 'lodash/startCase';
import sortBy from 'lodash/sortBy';
import { Button, Icon, styles, TooltipMessage, WithTooltip } from '@storybook/design-system';
import GatsbyLink from '../../../basics/GatsbyLink';
import getLanguageName from '../../../../lib/getLanguageName';

const { color, typography } = styles;

const LanguageMenuTitle = styled.div`
  font-size: ${typography.size.s2}px;
  color: ${color.dark};
  margin-bottom: 0.75rem;
`;

const TooltipList = styled.div`
  width: 200px;
`;

const Item = styled.div`
  position: relative;
  padding-left: 22px;

  &:not(:first-child) {
    border-top: 1px solid ${color.mediumlight};
  }

  &:not(:last-child) {
    margin-bottom: -9px;
  }

  .help-translate-link {
    margin-left: -22px;
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

const FrameworkImage = styled.img`
  width: 2rem;
  height: 2rem;
  padding: 5px;
  ${({ selectedFramework }) =>
    selectedFramework &&
    `
    border: 2px solid #5CACF7;
    border-radius:5px;
   
  `}
`;

const FrameworkContainer = styled.div`
  display: flex;
  align-items: center;
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
  font-weight: ${typography.weight.extrabold};
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
  // defines the initial chapter
  const expectedFirstChapter = `/${guide}/${framework}/${language}/${firstChapter}/`;

  const chapterInOtherLanguage = translationPages.edges.find(
    ({ node: { fields } }) => fields.slug === expectedSlug
  );
  if (chapterInOtherLanguage) {
    return expectedSlug;
  }
  // searches for the first chapter for the translation
  const firstInOtherLanguage = translationPages.edges.find(
    ({ node: { fields } }) => fields.slug === expectedFirstChapter
  );
  // if it exists returns the expected first chapter
  if (firstInOtherLanguage) {
    return firstInOtherLanguage;
  }
  // returns the default first chapter(ie the english version of the tutorial, preventing a 404)
  return `/${guide}/${framework}/en/${firstChapter}/`;
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

const FrameworkMenu = ({
  chapter,
  contributeUrl,
  firstChapter,
  framework,
  guide,
  language,
  translationPages,
}) => {
  const translationPagesByFramework = useMemo(
    () => getTranslationPagesByFramework(translationPages),
    [translationPages]
  );
  const frameworks = sortBy(
    Object.keys(translationPagesByFramework),
    frameworkName => frameworkName
  );

  if (
    // There is only one framework
    Object.keys(translationPagesByFramework).length < 2 &&
    // and that framework only has one translation
    Object.keys(translationPagesByFramework[framework]).length < 2
  ) {
    return (
      <Button
        appearance="outline"
        size="small"
        isLink
        href={contributeUrl}
        target="_blank"
        rel="noopener"
      >
        <ButtonContent>Help us translate</ButtonContent>
      </Button>
    );
  }
  const availableTranslations = sortBy(
    Object.keys(translationPagesByFramework[framework]),
    languageName => languageName
  );
  return (
    <>
      <LanguageMenuTitle>Framework:</LanguageMenuTitle>
      {
        <FrameworkContainer>
          {frameworks.map(availableFramework => (
            <Link
              to={getChapterInOtherLanguage(
                availableFramework,
                language,
                guide,
                chapter,
                firstChapter,
                translationPages
              )}
            >
              <FrameworkImage
                src={`/frameworks/logo-${availableFramework}.svg`}
                alt={startCase(availableFramework)}
                selectedFramework={availableFramework === framework}
              />
            </Link>
          ))}
        </FrameworkContainer>
      }
      <WithTooltip
        tagName="span"
        placement="bottom"
        trigger="click"
        closeOnClick
        tooltip={
          <TooltipList>
            <>
              <Item key={framework}>
                <TooltipMessage
                  title={`Available translations for the ${startCase(
                    framework
                  )} version of the tutorial`}
                />
              </Item>
              <Item>
                {availableTranslations.map((translation, frameworkIndex) => {
                  const isLastFramework = frameworkIndex + 1 === availableTranslations.length;
                  return (
                    <TooltipMessage
                      desc={
                        <>
                          <Link
                            key={translation}
                            to={getChapterInOtherLanguage(
                              framework,
                              translation,
                              guide,
                              chapter,
                              firstChapter,
                              translationPages
                            )}
                          >
                            {getLanguageName(translation)}
                          </Link>
                        </>
                      }
                      links={
                        isLastFramework
                          ? [
                              {
                                title: 'Help us translate',
                                href: contributeUrl,
                                target: '_blank',
                                rel: 'noopener',
                                className: 'help-translate-link',
                              },
                            ]
                          : null
                      }
                    />
                  );
                })}
              </Item>
            </>
          </TooltipList>
        }
      >
        <Button appearance="outline" size="small">
          <ButtonContent>
            {`${getLanguageName(language)}`}
            <ChevronDownIcon />
          </ButtonContent>
        </Button>
      </WithTooltip>
    </>
  );
};

/* const FrameworkMenu = ({
  chapter,
  contributeUrl,
  firstChapter,
  framework,
  guide,
  language,
  translationPages,
}) => {
  const translationPagesByFramework = useMemo(
    () => getTranslationPagesByFramework(translationPages),
    [translationPages]
  );
  const frameworks = sortBy(
    Object.keys(translationPagesByFramework),
    frameworkName => frameworkName
  );

  if (
    // There is only one framework
    Object.keys(translationPagesByFramework).length < 2 &&
    // and that framework only has one translation
    Object.keys(translationPagesByFramework[framework]).length < 2
  ) {
    return (
      <Button
        appearance="outline"
        size="small"
        isLink
        href={contributeUrl}
        target="_blank"
        rel="noopener"
      >
        <ButtonContent>Help us translate</ButtonContent>
      </Button>
    );
  }

  return (
    <>
      <LanguageMenuTitle>Framework and language:</LanguageMenuTitle>
      <WithTooltip
        tagName="span"
        placement="bottom"
        trigger="click"
        closeOnClick
        tooltip={
          <TooltipList>
            {frameworks.map((translationFramework, frameworkIndex) => {
              const isLastFramework = frameworkIndex + 1 === frameworks.length;
              const translationLanguages = sortBy(
                Object.keys(translationPagesByFramework[translationFramework]),
                languageName => languageName
              );

              return (
                <Item key={translationFramework}>
                  <Image
                    src={`/frameworks/logo-${translationFramework}.svg`}
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
                              guide,
                              chapter,
                              firstChapter,
                              translationPages
                            )}
                          >
                            {getLanguageName(translationLanguage)}
                          </Link>
                        ))}
                      </>
                    }
                    links={
                      isLastFramework
                        ? [
                            {
                              title: 'Help us translate',
                              href: contributeUrl,
                              target: '_blank',
                              rel: 'noopener',
                              className: 'help-translate-link',
                            },
                          ]
                        : null
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
    </>
  );
}; */

FrameworkMenu.propTypes = {
  chapter: PropTypes.string.isRequired,
  contributeUrl: PropTypes.string.isRequired,
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
