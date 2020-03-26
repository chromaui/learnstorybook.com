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
  .add('w/ 2 framework, 2 translations', () => (
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
          {
            node: {
              fields: {
                framework: 'angular',
                language: 'en',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'angular',
                language: 'es',
                slug: '/chapter',
              },
            },
          },
        ],
      }}
    />
  ))
  .add('w/ 5 framework, 2 translations', () => (
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
          {
            node: {
              fields: {
                framework: 'angular',
                language: 'en',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'angular',
                language: 'es',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'vue',
                language: 'en',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'vue',
                language: 'es',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'svelte',
                language: 'en',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'svelte',
                language: 'es',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'react-native',
                language: 'en',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'react-native',
                language: 'es',
                slug: '/chapter',
              },
            },
          },
        ],
      }}
    />
  ))
  .add('w/ 5 framework, all translations', () => (
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
          {
            node: {
              fields: {
                framework: 'react',
                language: 'zh-CN',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'react',
                language: 'zh-Tw',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'react',
                language: 'pt',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'react',
                language: 'nl',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'react',
                language: 'de',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'angular',
                language: 'en',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'angular',
                language: 'es',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'vue',
                language: 'en',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'vue',
                language: 'es',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'svelte',
                language: 'en',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'svelte',
                language: 'es',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'react-native',
                language: 'en',
                slug: '/chapter',
              },
            },
          },
          {
            node: {
              fields: {
                framework: 'react-native',
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
