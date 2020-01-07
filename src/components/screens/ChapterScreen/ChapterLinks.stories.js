import React from 'react';
import ChapterLinks from './ChapterLinks';

export default {
  component: ChapterLinks,
  excludeStories: /.*Data$/,
  title: 'Screens|ChapterScreen/ChapterLinks',
};

const ChapterLinksData = 'guide';

export const WithCommit = () => (
  <ChapterLinks codeGithubUrl="https://github.com" commit="AAAAAA" guide={ChapterLinksData} />
);
export const WithoutCommit = () => <ChapterLinks guide={ChapterLinksData} />;
