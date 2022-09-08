import React from 'react';
import ChapterLinks from './ChapterLinks';

export default {
  component: ChapterLinks,
  title: 'Screens/ChapterScreen/ChapterLinks',
  args: {
    guide: 'guide',
  },
};

function Story(args) {
  return <ChapterLinks {...args} />;
}

export const WithCommit = Story.bind({});
WithCommit.args = {
  codeGithubUrl: 'https://github.com',
  commit: 'AAAAAA',
};

export const WithoutCommit = Story.bind({});
