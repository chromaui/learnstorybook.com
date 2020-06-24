import React from 'react';
import ChapterLinks from './ChapterLinks';

export default {
  component: ChapterLinks,
  excludeStories: /.*Data$/,
  title: 'Screens/ChapterScreen/ChapterLinks',
};

const ChapterLinksData = 'guide';

export const Basic = () => (
  <ChapterLinks codeGithubUrl="https://github.com" commit="AAAAAA" guide={ChapterLinksData} />
);
Basic.storyName = 'with commit';

export const WithoutCommit = () => <ChapterLinks guide={ChapterLinksData} />;
WithoutCommit.storyName = 'without commit';
