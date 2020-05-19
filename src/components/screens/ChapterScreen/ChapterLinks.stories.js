import React from 'react';
import { storiesOf } from '@storybook/react';
import ChapterLinks from './ChapterLinks';

const guide = 'guide';

const defaultLinkText = {
  twitterLinkDisplayText:
    'Is this free guide helping you? Tweet to give kudos and help other devs find it.',
  gitLinkDisplayText: 'Keep your code in sync with this chapter. View on GitHub the commit AAAAAA',
};
const translatedLinkText = {
  twitterLinkDisplayText:
    'Este guia gratuito está a ajudar-te? Tweeta para elogiar e ajudar outros programadores a descobri-lo',
  gitLinkDisplayText:
    'Mantém o teu código sincronizado com este capítulo. Vê no GitHub o commit AAAAAA',
};

storiesOf('Screens|ChapterScreen/ChapterLinks', module)
  .add('with commit', () => (
    <ChapterLinks
      codeGithubUrl="https://github.com"
      commit="AAAAAA"
      guide={guide}
      twitterLinkDisplayText={defaultLinkText.twitterLinkDisplayText}
      gitLinkDisplayText={defaultLinkText.gitLinkDisplayText}
    />
  ))
  .add('without commit', () => <ChapterLinks guide={guide} />)
  .add('with commit in another language', () => (
    <ChapterLinks
      codeGithubUrl="https://github.com"
      commit="AAAAAA"
      guide={guide}
      twitterLinkDisplayText={translatedLinkText.twitterLinkDisplayText}
      gitLinkDisplayText={translatedLinkText.gitLinkDisplayText}
    />
  ));
