import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { Menu } from '@storybook/components-marketing';
import { styled } from '@storybook/theming';
import { sortBy } from 'lodash';

import { coreFrameworks, communityFrameworks } from '../../../content/docs/frameworks';
import getChapterInOtherLanguage from '../../../lib/getChapterInOtherLanguage';
import { GatsbyLinkWrapper } from '../../basics/GatsbyLink';

const frameworksByPopularity = [...coreFrameworks, ...communityFrameworks];
frameworksByPopularity.splice(frameworksByPopularity.indexOf('react') + 1, 0, 'react-native');

const getTranslationPagesByFramework = (translationPages) =>
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

const frameworkStyleMap = {
  html: 'HTML',
  'react-native': 'React Native',
  'web-components': 'Web Components',
};

function stylizeFramework(framework) {
  return frameworkStyleMap[framework] || `${framework[0].toUpperCase()}${framework.slice(1)}`;
}

const getFrameworkLogo = (framework) => {
  if (framework === 'rax') return '/frameworks/logo-rax.png';
  return withPrefix(`/frameworks/logo-${framework}.svg`);
};

const FrameworkLogo = styled.img`
  width: 12;
  height: 12;
`;

function FrameworkSelector({
  chapter,
  firstChapter,
  framework,
  guide,
  language,
  translationPages,
}) {
  const translationPagesByFramework = React.useMemo(
    () => getTranslationPagesByFramework(translationPages),
    [translationPages]
  );

  const items = sortBy(Object.keys(translationPagesByFramework), (f) =>
    frameworksByPopularity.indexOf(f)
  ).map((f) => ({
    link: {
      LinkWrapper: GatsbyLinkWrapper,
      url: withPrefix(
        getChapterInOtherLanguage(language, guide, chapter, firstChapter, translationPages, f)
      ),
    },
    icon: <FrameworkLogo src={getFrameworkLogo(f)} alt="" />,
    label: stylizeFramework(f),
  }));

  return <Menu label={stylizeFramework(framework)} items={items} primary />;
}

FrameworkSelector.propTypes = {
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

export default FrameworkSelector;
