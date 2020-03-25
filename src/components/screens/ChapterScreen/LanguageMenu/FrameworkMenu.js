import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import startCase from 'lodash/startCase';
import sortBy from 'lodash/sortBy';
import { Link as GatsbyLinkWithoutEffects } from 'gatsby';
import { Button, Icon, styles, WithTooltip, TooltipLinkList } from '@storybook/design-system';
import GatsbyLink from '../../../basics/GatsbyLink';
import getLanguageName from '../../../../lib/getLanguageName';

const { color, typography } = styles;

const LanguageMenuTitle = styled.div`
  font-size: ${typography.size.s2}px;
  color: ${color.dark};
  margin-bottom: 0.75rem;
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

const TooltipLinkListLinkWrapper = ({ href, to, ...rest }) => {
  if (href){
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a {...rest} href={href} />;
  }
  return <GatsbyLinkWithoutEffects {...rest} to={to} />;
};

TooltipLinkListLinkWrapper.propTypes = {
  href: PropTypes.string,
  to: PropTypes.string,
};

TooltipLinkListLinkWrapper.defaultProps = {
  href: null,
  to: null,
};
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

  // this might be only applied to for now to design systems for developers( and even then....)
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
  )
    .map(translationLanguage => {
      return {
        short: translationLanguage,
        title: getLanguageName(translationLanguage),
        href: getChapterInOtherLanguage(
          framework,
          translationLanguage,
          guide,
          chapter,
          firstChapter,
          translationPages
        ),
      };
    })
    .concat([{ short: 'zz', title: 'Help us translate!', href: contributeUrl }]);

  return (
    <>
      <LanguageMenuTitle>Framework:</LanguageMenuTitle>
      <FrameworkContainer>
        {frameworks.map(availableFramework => (
          <Link
            key={`link_${availableFramework}`}
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
      <WithTooltip
        tagName="span"
        placement="bottom"
        trigger="click"
        closeOnClick
        tooltip={
          <TooltipLinkList links={availableTranslations} LinkWrapper={TooltipLinkListLinkWrapper} />
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
