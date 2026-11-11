import { test } from 'node:test';
import assert from 'node:assert/strict';
import getGuideLanguageLinks from './getGuideLanguageLinks.js';

const edge = (language, chapter, slug, framework) => ({
  node: { fields: { language, chapter, slug, framework } },
});

test('non-framework guide links each language to its first chapter', () => {
  const translationPages = {
    edges: [
      edge('en', 'build-in-your-content', '/g/en/build-in-your-content/'),
      edge('en', 'get-started', '/g/en/get-started/'),
    ],
  };
  assert.deepEqual(getGuideLanguageLinks({ translationPages, firstChapter: 'get-started' }), [
    { language: 'en', tutorial: '/g/en/get-started/' },
  ]);
});

test('framework guide prefers the react edition of the first chapter', () => {
  const translationPages = {
    edges: [
      edge('en', 'get-started', '/g/vue/en/get-started/', 'vue'),
      edge('en', 'get-started', '/g/react/en/get-started/', 'react'),
    ],
  };
  assert.deepEqual(getGuideLanguageLinks({ translationPages, firstChapter: 'get-started' }), [
    { language: 'en', tutorial: '/g/react/en/get-started/' },
  ]);
});

test('a language without the first chapter links to its first available page', () => {
  const translationPages = {
    edges: [
      edge('en', 'introduction', '/g/react/en/introduction/', 'react'),
      edge('fr', 'workflow', '/g/react/fr/workflow/', 'react'),
    ],
  };
  assert.deepEqual(getGuideLanguageLinks({ translationPages, firstChapter: 'introduction' }), [
    { language: 'en', tutorial: '/g/react/en/introduction/' },
    { language: 'fr', tutorial: '/g/react/fr/workflow/' },
  ]);
});

test('languages are returned once each, in first-seen order', () => {
  const translationPages = {
    edges: [edge('es', 'a', '/g/es/a/'), edge('en', 'a', '/g/en/a/'), edge('es', 'b', '/g/es/b/')],
  };
  assert.deepEqual(
    getGuideLanguageLinks({ translationPages, firstChapter: 'a' }).map((l) => l.language),
    ['es', 'en']
  );
});
