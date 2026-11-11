const { test } = require('node:test');
const assert = require('node:assert/strict');
const codeButtons = require('./index.js');

const run = (lang, value = 'const a = 1;') => {
  const code = { type: 'code', lang, value };
  const markdownAST = { type: 'root', children: [code] };
  codeButtons({ markdownAST });
  return markdownAST.children;
};

test('a plain language gets a copy button inserted before it and keeps its lang', () => {
  const children = run('js');
  assert.equal(children.length, 2);
  assert.equal(children[0].type, 'html');
  assert.match(children[0].value, /gatsby-code-button/);
  assert.equal(children[1].lang, 'js');
});

test('clipboard=false suppresses the button and is stripped from the lang', () => {
  const children = run('js:clipboard=false');
  assert.equal(children.length, 1);
  assert.equal(children[0].lang, 'js');
});

test('other fence params survive with and without a button', () => {
  assert.equal(run('js:title=foo&clipboard=false')[0].lang, 'js:title=foo');
  const withButton = run('js:title=foo');
  assert.equal(withButton.length, 2);
  assert.equal(withButton[1].lang, 'js:title=foo');
});

test('diff fences copy only added and context lines, without markers', () => {
  const children = run('diff', '-removed\n+added\n context');
  assert.equal(children.length, 2);
  assert.ok(children[0].value.includes('copyToClipboard(`added\n context`'));
});

test('a fence without a language is left untouched', () => {
  const children = run('');
  assert.equal(children.length, 1);
  assert.equal(children[0].lang, '');
});

test('the copy control is a real button, so keyboards and screen readers reach it', () => {
  const [buttonNode] = run('js');
  assert.match(
    buttonNode.value,
    /<button\s+type="button"[^>]*class="gatsby-code-button"[^>]*onclick="copyToClipboard\(/
  );
  assert.doesNotMatch(buttonNode.value, /<div[^>]*onClick/i);
});
