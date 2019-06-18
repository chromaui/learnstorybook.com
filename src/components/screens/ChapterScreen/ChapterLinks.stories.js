import React from 'react';
import { storiesOf } from '@storybook/react';
import ChapterLinks from './ChapterLinks';

storiesOf('Screens|ChapterScreen/ChapterLinks', module)
  .add('with commit', () => <ChapterLinks codeGithubUrl="https://github.com" commit="AAAAAA" />)
  .add('without commit', () => <ChapterLinks codeGithubUrl="https://github.com" />);
