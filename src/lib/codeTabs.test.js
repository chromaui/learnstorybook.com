import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
// The HTML conversion mirrors gatsby-transformer-remark's: remark parses the markdown, the site's
// remark plugins edit the mdast, mdast-util-to-hast and hast-util-to-html produce the HTML. These
// packages are the transformer's own dependencies, so they are not listed in package.json.
/* eslint-disable import/no-extraneous-dependencies */
import remark from 'remark';
import toHast from 'mdast-util-to-hast';
import toHtml from 'hast-util-to-html';
/* eslint-enable import/no-extraneous-dependencies */
import { splitCodeTabs, pickActiveTab } from './codeTabs.js';

const require = createRequire(import.meta.url);
const codeTabs = require('../../plugins/gatsby-remark-code-tabs/index.js');
const codeButtons = require('../../plugins/gatsby-remark-code-buttons-with-diff-support/index.js');

const render = (markdown) => {
  const markdownAST = remark().parse(markdown);
  codeTabs({ markdownAST });
  codeButtons({ markdownAST });
  return toHtml(toHast(markdownAST, { allowDangerousHtml: true }), { allowDangerousHtml: true });
};

const markdown = `Intro paragraph.

\`\`\`sh packageManager=npm
npx storybook init
\`\`\`

\`\`\`sh packageManager=pnpm
pnpm dlx storybook init
\`\`\`

Outro paragraph.
`;

test('html without tab markers is one html segment, untouched', () => {
  const html = '<p>Hello</p>\n<pre><code>x</code></pre>';
  assert.deepEqual(splitCodeTabs(html), [{ type: 'html', html }]);
});

test('a tab group splits the html into prose, tabs and prose', () => {
  const segments = splitCodeTabs(render(markdown));
  assert.deepEqual(
    segments.map((segment) => segment.type),
    ['html', 'tabs', 'html']
  );
  assert.match(segments[0].html, /<p>Intro paragraph\.<\/p>/);
  assert.match(segments[2].html, /<p>Outro paragraph\.<\/p>/);
});

test('each tab keeps its id and its own html, copy button included', () => {
  const [, tabs] = splitCodeTabs(render(markdown));
  assert.equal(tabs.group, 'packageManager');
  assert.deepEqual(
    tabs.tabs.map((tab) => tab.id),
    ['npm', 'pnpm']
  );
  assert.match(tabs.tabs[0].html, /gatsby-code-button/);
  assert.match(tabs.tabs[0].html, /<pre><code class="language-sh">npx storybook init/);
  assert.match(tabs.tabs[1].html, /pnpm dlx storybook init/);
  assert.doesNotMatch(tabs.tabs[1].html, /npx storybook init/);
});

test('no marker text leaks into any segment', () => {
  const segments = splitCodeTabs(render(markdown));
  const all = segments.map((segment) =>
    segment.type === 'html' ? segment.html : segment.tabs.map((tab) => tab.html).join('')
  );
  all.forEach((html) => assert.doesNotMatch(html, /code-tab/));
});

test('empty prose segments are dropped, so a page can start with or chain groups', () => {
  const html = render(`\`\`\`sh packageManager=npm
a
\`\`\`

\`\`\`js framework=react
b
\`\`\`
`);
  assert.deepEqual(
    splitCodeTabs(html).map((segment) => segment.type),
    ['tabs', 'tabs']
  );
});

test('encoded ids are decoded', () => {
  const [tabs] = splitCodeTabs(render('```sh framework="React Native"\nx\n```\n'));
  assert.deepEqual(
    tabs.tabs.map((tab) => tab.id),
    ['React Native']
  );
});

test('pickActiveTab prefers the saved choice when the group has it', () => {
  const tabs = [{ id: 'npm' }, { id: 'pnpm' }, { id: 'yarn' }];
  assert.equal(pickActiveTab(tabs, 'yarn'), 'yarn');
});

test('pickActiveTab falls back to the first tab when there is no saved choice or no match', () => {
  const tabs = [{ id: 'npm' }, { id: 'pnpm' }];
  assert.equal(pickActiveTab(tabs, null), 'npm');
  assert.equal(pickActiveTab(tabs, 'bun'), 'npm');
});
