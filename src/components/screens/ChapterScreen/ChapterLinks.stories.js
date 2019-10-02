import React from 'react';
import { storiesOf } from '@storybook/react';
import ChapterLinks from './ChapterLinks';

const guide = 'guide';

storiesOf('Screens|ChapterScreen/ChapterLinks', module)
  .add('with commit', () => (
    <ChapterLinks codeGithubUrl="https://github.com" commit="AAAAAA" guide={guide} />
  ))
  .add('without commit', () => <ChapterLinks guide={guide} />);
