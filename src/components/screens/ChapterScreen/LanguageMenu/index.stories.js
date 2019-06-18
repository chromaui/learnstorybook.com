import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import LanguageMenu from './index';

const Wrapper = styled.div`
  padding: 20px;
`;

storiesOf('Screens|ChapterScreen/LanguageMenu', module)
  .addParameters({ component: LanguageMenu })
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add('for framework guide', () => (
    <LanguageMenu
      framework="react"
      chapter="chapter"
      firstChapter="get-started"
      guide="guide"
      language="en"
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
  ));
