const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
// The HTML conversion mirrors gatsby-transformer-remark's; these are its own dependencies.
/* eslint-disable import/no-extraneous-dependencies */
const remark = require('remark');
const toHast = require('mdast-util-to-hast');
const toHtml = require('hast-util-to-html');
/* eslint-enable import/no-extraneous-dependencies */
const config = require('../gatsby-config.js');

// The remark plugins from gatsby-config.js, in the configured order, limited to the ones that
// shape code blocks (the image and link plugins need a Gatsby runtime).
const codeBlockPlugins = config.plugins
  .find((plugin) => plugin.resolve === 'gatsby-transformer-remark')
  .options.plugins.map((plugin) => (typeof plugin === 'string' ? plugin : plugin.resolve))
  .filter((name) => name.startsWith('gatsby-remark-code'))
  .map((name) => {
    const local = path.join(__dirname, name, 'index.js');
    try {
      return require(local);
    } catch {
      return require(name);
    }
  });

const render = (markdown) => {
  const markdownAST = remark().parse(markdown);
  codeBlockPlugins.forEach((plugin) => plugin({ markdownAST }));
  return toHtml(toHast(markdownAST, { allowDangerousHtml: true }), { allowDangerousHtml: true });
};

const tagOrder = (html) =>
  [...html.matchAll(/class="(gatsby-code-title|gatsby-code-button-container)"|<pre/g)].map(
    (match) => match[1] ?? 'pre'
  );

test('a titled fence renders as title bar, then copy button, then code', () => {
  const html = render('```js:title=src/App.js\nconst a = 1;\n```\n');
  assert.deepEqual(tagOrder(html), ['gatsby-code-title', 'gatsby-code-button-container', 'pre']);
});

test('a plain fence renders as copy button, then code', () => {
  const html = render('```js\nconst a = 1;\n```\n');
  assert.deepEqual(tagOrder(html), ['gatsby-code-button-container', 'pre']);
});

test('clipboard=false keeps the title bar and drops the button', () => {
  const html = render('```js:title=src/App.js&clipboard=false\nconst a = 1;\n```\n');
  assert.deepEqual(tagOrder(html), ['gatsby-code-title', 'pre']);
});
