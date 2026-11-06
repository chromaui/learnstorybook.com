import { test } from 'node:test';
import assert from 'node:assert/strict';
import getTutorialUpToDate from './getTutorialUpToDate.js';

const tutorialStatus = {
  'intro-to-storybook': { react: { en: 10, es: 8.3 } },
  'ai-ready-design-systems': { en: 10 },
};
const storybookVersion = 10;

test('framework guide: true when the version matches', () => {
  assert.equal(
    getTutorialUpToDate({
      tutorialStatus,
      storybookVersion,
      guide: 'intro-to-storybook',
      framework: 'react',
      language: 'en',
    }),
    true
  );
});

test('framework guide: false when the version lags', () => {
  assert.equal(
    getTutorialUpToDate({
      tutorialStatus,
      storybookVersion,
      guide: 'intro-to-storybook',
      framework: 'react',
      language: 'es',
    }),
    false
  );
});

test('non-framework guide: looks up by language', () => {
  assert.equal(
    getTutorialUpToDate({
      tutorialStatus,
      storybookVersion,
      guide: 'ai-ready-design-systems',
      language: 'en',
    }),
    true
  );
});

test('returns undefined when the guide, framework or language has no entry', () => {
  assert.equal(
    getTutorialUpToDate({ tutorialStatus, storybookVersion, guide: 'missing', language: 'en' }),
    undefined
  );
  assert.equal(
    getTutorialUpToDate({
      tutorialStatus,
      storybookVersion,
      guide: 'intro-to-storybook',
      framework: 'vue',
      language: 'en',
    }),
    undefined
  );
  assert.equal(
    getTutorialUpToDate({
      tutorialStatus,
      storybookVersion,
      guide: 'ai-ready-design-systems',
      language: 'fr',
    }),
    undefined
  );
});
