import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import LanguageMenu from './index';

const Wrapper = styled.div`
  padding: 20px;
`;

const sharedProps = {
  chapter: 'chapter',
  contributeUrl: '/contribute',
  firstChapter: 'get-started',
  guide: 'guide',
  language: 'en',
};

storiesOf('Screens|ChapterScreen/LanguageMenu', module)
  .addParameters({ component: LanguageMenu })
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add('w/ framework, 1 translation', () => (
    <LanguageMenu
      {...sharedProps}
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
  ))
  .add('w/ framework, 2 translations', () => (
    <LanguageMenu
      {...sharedProps}
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
  ))
  .add('no framework, 1 translation', () => (
    <LanguageMenu
      {...sharedProps}
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
  ))
  .add('no framework, 2 translations', () => (
    <LanguageMenu
      {...sharedProps}
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
  ));
