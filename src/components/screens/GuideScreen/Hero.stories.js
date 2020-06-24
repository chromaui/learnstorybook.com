import React from 'react';
import Hero from './Hero';

export default {
  component: Hero,
  excludeStories: /.*Data$/,
  title: 'Screens/GuideScreen/Hero',
};

// list of possible available languages used for stories
const storyLanguagesData = [
  {
    name: 'English',
    tutorial: '/intro-to-storybook/react/en/get-started/',
  },
  {
    name: 'Español',
    tutorial: '/intro-to-storybook/react/es/get-started/',
  },
  {
    name: 'Português',
    tutorial: '/intro-to-storybook/react/pt/get-started/',
  },
  {
    name: '简体中文',
    tutorial: '/intro-to-storybook/react/zh-CN/get-started/',
  },
  {
    name: '繁體中文',
    tutorial: '/intro-to-storybook/react/zh-TW/get-started/',
  },
  {
    name: 'Nederlandse',
    tutorial: '/intro-to-storybook/react/nl/get-started/',
  },
  {
    name: 'Deutsche',
    tutorial: '/intro-to-storybook/react/de/get-started/',
  },
  {
    name: 'Polskie',
    tutorial: '/intro-to-storybook/react/pl/get-started/',
  },
  {
    name: '한국어',
    tutorial: '/intro-to-storybook/react/kr/get-started/',
  },
  {
    name: '日本語',
    tutorial: '/intro-to-storybook/react/jp/get-started/',
  },
  {
    name: 'South African',
    tutorial: '/intro-to-storybook/react/za/get-started/',
  },
  {
    name: 'Svenska',
    tutorial: '/intro-to-storybook/react/se/get-started/',
  },
  {
    name: 'Français',
    tutorial: '/intro-to-storybook/react/fr/get-started/',
  },
  {
    name: 'Slovensko',
    tutorial: '/intro-to-storybook/react/si/get-started/',
  },
  {
    name: 'български',
    tutorial: '/intro-to-storybook/react/bg/get-started/',
  },
  {
    name: 'Ungherese',
    tutorial: '/intro-to-storybook/react/hu/get-started/',
  },
  {
    name: 'Italiano',
    tutorial: '/intro-to-storybook/react/it/get-started/',
  },
  {
    name: 'Türk',
    tutorial: '/intro-to-storybook/react/tr/get-started/',
  },
  {
    name: 'ישראלי',
    tutorial: '/intro-to-storybook/react/il/get-started/',
  },
  {
    name: 'Ελληνικά',
    tutorial: '/intro-to-storybook/react/gr/get-started/',
  },
  {
    name: 'русский',
    tutorial: '/intro-to-storybook/react/ru/get-started/',
  },
];
// list of baseline language for the first 3 stories
export const defaultLanguagesData = storyLanguagesData.slice(0, 5);

export const Basic = args => <Hero {...args} />;
Basic.storyName = 'default';
Basic.args = {
  ctaHref: '/get-started',
  description:
    "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.",
  imagePath: '/guide-cover/intro.svg',
  themeColor: '#6F2CAC',
  title: 'Visual Testing Handbook',
  languages: defaultLanguagesData,
};

export const WithContributorCount = Basic.bind();
WithContributorCount.storyName = 'with contributor count';
WithContributorCount.args = {
  ctaHref: '/get-started',
  description:
    "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.",
  imagePath: '/guide-cover/intro.svg',
  themeColor: '#6F2CAC',
  title: 'Visual Testing Handbook',
  contributorCount: '34+',
  languages: defaultLanguagesData,
};
export const WithChapterCount = Basic.bind();
WithChapterCount.storyName = 'with chapter count';
WithChapterCount.args = {
  ctaHref: '/get-started',
  description:
    "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.",
  imagePath: '/guide-cover/intro.svg',
  themeColor: '#6F2CAC',
  title: 'Visual Testing Handbook',
  contributorCount: '34+',
  languages: defaultLanguagesData,
  chapterCount: 9,
};
export const OneLanguage = Basic.bind();
OneLanguage.storyName = 'with only one language';
OneLanguage.args = {
  ctaHref: '/get-started',
  description:
    "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.",
  imagePath: '/guide-cover/intro.svg',
  themeColor: '#6F2CAC',
  title: 'Visual Testing Handbook',
  contributorCount: '34+',
  chapterCount: 9,
  languages: storyLanguagesData.slice(0, 1),
};
export const AboveFiveLanguages = Basic.bind();
AboveFiveLanguages.storyName = 'with +5 languages';
AboveFiveLanguages.args = {
  ctaHref: '/get-started',
  description:
    "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.",
  imagePath: '/guide-cover/intro.svg',
  themeColor: '#6F2CAC',
  title: 'Visual Testing Handbook',
  contributorCount: '34+',
  chapterCount: 9,
  languages: storyLanguagesData.slice(0, 7),
};
export const AboveTenLanguages = Basic.bind();
AboveTenLanguages.storyName = 'with +10 languages';
AboveTenLanguages.args = {
  ctaHref: '/get-started',
  description:
    "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.",
  imagePath: '/guide-cover/intro.svg',
  themeColor: '#6F2CAC',
  title: 'Visual Testing Handbook',
  contributorCount: '34+',
  chapterCount: 9,
  languages: storyLanguagesData.slice(0, 12),
};
export const AboveTwentyLanguages = Basic.bind();
AboveTwentyLanguages.storyName = 'with +20 languages';
AboveTwentyLanguages.args = {
  ctaHref: '/get-started',
  description:
    "Visual testing is a pragmatic yet precise way to verify the look of UI components. It's practiced by companies like Slack, Lonely Planet and Walmart. This 31-page handbook gives you an overview of visual testing in React.",
  imagePath: '/guide-cover/intro.svg',
  themeColor: '#6F2CAC',
  title: 'Visual Testing Handbook',
  contributorCount: '34+',
  chapterCount: 9,
  languages: storyLanguagesData,
};
