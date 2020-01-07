import React from 'react';
import styled from 'styled-components';
import LanguageMenu from './index';

export default {
  component: LanguageMenu,
  excludeStories: /.*Data$/,
  decorators: [story => <Wrapper>{story()}</Wrapper>],
  title: 'Screens|ChapterScreen/LanguageMenu',
};
const Wrapper = styled.div`
  padding: 20px;
`;

const LanguageMenuData = {
  chapter: 'chapter',
  contributeUrl: '/contribute',
  firstChapter: 'get-started',
  guide: 'guide',
  language: 'en',
};

export const WithFrameworkOneTranslation = () => (
  <LanguageMenu
    {...LanguageMenuData}
    framework="react"
    translationPages={{
      edges: [
        {
          node: {
            fields: {
              framework: 'react',
              language: 'en',
              slug: '/chapter',
            },
          },
        },
      ],
    }}
  />
);

export const WithFrameworkTwoTranslations = () => (
  <LanguageMenu
    {...LanguageMenuData}
    translationPages={{
      edges: [
        {
          node: {
            fields: {
              framework: 'react',
              language: 'en',
              slug: '/chapter',
            },
          },
        },
        {
          node: {
            fields: {
              framework: 'react',
              language: 'es',
              slug: '/chapter',
            },
          },
        },
      ],
    }}
  />
);

export const NoFrameworkOneTranslation = () => (
  <LanguageMenu
    {...LanguageMenuData}
    translationPages={{
      edges: [
        {
          node: {
            fields: {
              language: 'en',
              slug: '/chapter',
            },
          },
        },
      ],
    }}
  />
);
export const NoFrameworkTwoTranslations = () => (
  <LanguageMenu
    {...LanguageMenuData}
    translationPages={{
      edges: [
        {
          node: {
            fields: {
              language: 'en',
              slug: '/chapter',
            },
          },
        },
        {
          node: {
            fields: {
              language: 'pt',
              slug: '/chapter',
            },
          },
        },
      ],
    }}
  />
);
