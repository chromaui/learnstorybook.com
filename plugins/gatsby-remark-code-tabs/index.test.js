const { test } = require('node:test');
const assert = require('node:assert/strict');
const codeTabs = require('./index.js');

const code = (meta, value = 'echo hi', lang = 'sh') => ({ type: 'code', lang, meta, value });
const paragraph = () => ({ type: 'paragraph', children: [{ type: 'text', value: 'Then:' }] });

const run = (...children) => {
  const markdownAST = { type: 'root', children };
  codeTabs({ markdownAST });
  return markdownAST.children;
};

const outline = (children) =>
  children.map((node) => (node.type === 'html' ? node.value : `${node.type}:${node.lang}`));

test('adjacent fences sharing a meta key become one group with a tab per fence', () => {
  const children = run(code('packageManager=npm'), code('packageManager=pnpm'));
  assert.deepEqual(outline(children), [
    '<!--code-tabs:packageManager-->',
    '<!--code-tab:npm-->',
    'code:sh',
    '<!--code-tab:pnpm-->',
    'code:sh',
    '<!--/code-tabs-->',
  ]);
});

test('the meta is consumed so nothing downstream sees it', () => {
  const children = run(code('packageManager=npm'));
  const fence = children.find((node) => node.type === 'code');
  assert.equal(fence.meta, undefined);
});

test('quoted values are accepted and may contain spaces', () => {
  const children = run(code('framework="React Native"'), code('framework=vue'));
  assert.equal(children[1].value, `<!--code-tab:${encodeURIComponent('React Native')}-->`);
  assert.equal(children[3].value, '<!--code-tab:vue-->');
});

test('a node between two fences splits them into separate groups', () => {
  const children = run(code('packageManager=npm'), paragraph(), code('packageManager=pnpm'));
  assert.deepEqual(outline(children), [
    '<!--code-tabs:packageManager-->',
    '<!--code-tab:npm-->',
    'code:sh',
    '<!--/code-tabs-->',
    'paragraph:undefined',
    '<!--code-tabs:packageManager-->',
    '<!--code-tab:pnpm-->',
    'code:sh',
    '<!--/code-tabs-->',
  ]);
});

test('adjacent fences with different keys form separate groups', () => {
  const children = run(code('packageManager=npm'), code('framework=react'));
  assert.deepEqual(outline(children), [
    '<!--code-tabs:packageManager-->',
    '<!--code-tab:npm-->',
    'code:sh',
    '<!--/code-tabs-->',
    '<!--code-tabs:framework-->',
    '<!--code-tab:react-->',
    'code:sh',
    '<!--/code-tabs-->',
  ]);
});

test('fences without a key=value meta are left alone, including the lang query params', () => {
  const children = run(code(undefined, 'a', 'sh:clipboard=false'), code('{1,3}', 'b', 'js'));
  assert.deepEqual(outline(children), ['code:sh:clipboard=false', 'code:js']);
  assert.equal(children[1].meta, '{1,3}');
});

test('the lang query params survive on a tabbed fence', () => {
  const children = run(code('packageManager=npm', 'a', 'sh:clipboard=false'));
  assert.equal(children[2].lang, 'sh:clipboard=false');
});

test('a fence carrying more than one key fails the build with a clear message', () => {
  assert.throws(
    () => run(code('packageManager=npm framework=react')),
    /one tab key per fence.*packageManager=npm framework=react/
  );
});

test('groups nested inside other nodes are handled too', () => {
  const list = {
    type: 'list',
    children: [
      {
        type: 'listItem',
        children: [paragraph(), code('packageManager=npm'), code('packageManager=yarn')],
      },
    ],
  };
  run(list);
  assert.deepEqual(outline(list.children[0].children), [
    'paragraph:undefined',
    '<!--code-tabs:packageManager-->',
    '<!--code-tab:npm-->',
    'code:sh',
    '<!--code-tab:yarn-->',
    'code:sh',
    '<!--/code-tabs-->',
  ]);
});
