import React from 'react';
import { storiesOf } from '@storybook/react';
import TranslationUpdated from './TranslationUpdated';

const defaultLanguage = 'en';
const translatedLanguage = 'es';
const defaultStorybookVersion = 5.3;
const translationData = [
  {
    language: 'de',
    version: 5.2,
  },
  {
    language: 'en',
    version: 5.3,
  },
  {
    language: 'es',
    version: 5.2,
  },
  {
    language: 'nl',
    version: 5.2,
  },
  {
    language: 'pt',
    version: 5.3,
  },
  {
    language: 'zh-CN',
    version: 5.2,
  },
  {
    language: 'zh-TW',
    version: 5.2,
  },
];
storiesOf('Screens|ChapterScreen/TranslationUpdated', module)
  .addParameters({ component: TranslationUpdated })
  .add('default', () => (
    <TranslationUpdated
      currentLanguage={defaultLanguage}
      currentTranslations={translationData}
      storybookVersion={defaultStorybookVersion}
    />
  ))
  .add('translation not updated', () => (
    <TranslationUpdated
      currentLanguage={translatedLanguage}
      currentTranslations={translationData}
      storybookVersion={defaultStorybookVersion}
    />
  ));
