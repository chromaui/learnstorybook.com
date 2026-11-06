import { test } from 'node:test';
import assert from 'node:assert/strict';
import getThemeBackground from './getThemeBackground.js';
import { sunrise } from '../styles/gradients.js';

test('returns the named gradient', () => {
  assert.equal(
    getThemeBackground({ themeColor: '#EA580C', themeGradientName: 'sunrise' }),
    sunrise
  );
});

test('falls back to themeColor when no name is given', () => {
  assert.equal(getThemeBackground({ themeColor: '#6F2CAC' }), '#6F2CAC');
  assert.equal(getThemeBackground({ themeColor: '#6F2CAC', themeGradientName: null }), '#6F2CAC');
});

test('falls back to themeColor when the name is unknown', () => {
  assert.equal(getThemeBackground({ themeColor: '#6F2CAC', themeGradientName: 'nope' }), '#6F2CAC');
});
