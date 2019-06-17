import React from 'react';
import { storiesOf } from '@storybook/react';
import ChapterLinks from './ChapterLinks';

storiesOf('Screens|ChapterScreen/ChapterLinks', module).add('default', () => (
  <ChapterLinks codeGithubUrl="https://github.com" commit="AAAAAA" />
));
