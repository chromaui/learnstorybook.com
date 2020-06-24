import React from 'react';
import ChapterLinks from './ChapterLinks';

export default {
  component: ChapterLinks,
  title: 'Screens/ChapterScreen/ChapterLinks',
};

export const Basic = args => <ChapterLinks {...args} />;
Basic.storyName = 'with commit';
Basic.args = {
  codeGithubUrl: 'https://github.com',
  commit: 'AAAAAA',
  guide: 'guide',
};

export const WithoutCommit = Basic.bind();
WithoutCommit.storyName = 'without commit';
WithoutCommit.args = {
  guide: 'guide',
};
