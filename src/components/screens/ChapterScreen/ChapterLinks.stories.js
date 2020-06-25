import React from 'react';
import ChapterLinks from './ChapterLinks';

export default {
  component: ChapterLinks,
  title: 'Screens/ChapterScreen/ChapterLinks',
  args: {
    guide: 'guide',
  },
};

const ChapterLinksStory = args => <ChapterLinks {...args} />;

export const WithCommit = ChapterLinksStory.bind();
WithCommit.args = {
  codeGithubUrl: 'https://github.com',
  commit: 'AAAAAA',
};

export const WithoutCommit = ChapterLinksStory.bind();
