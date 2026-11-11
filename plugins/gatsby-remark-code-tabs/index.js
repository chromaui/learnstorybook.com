/**
 * Turns adjacent fenced code blocks tagged with the same meta key into one tabbed snippet.
 *
 *     ```sh packageManager=npm
 *     npx storybook init
 *     ```
 *
 *     ```sh packageManager=pnpm
 *     pnpm dlx storybook init
 *     ```
 *
 * The key names the tab group and the value names the tab: readers pick one tab per group and the
 * choice follows them across every snippet of that group on the site. The meta is the part of the
 * fence info string after the first space; it is separate from the `lang:option=value` query that
 * the copy-button and code-title plugins read, so both can be combined on one fence.
 *
 * The groups are marked with HTML comments around and between the fences. gatsby-transformer-remark
 * emits them verbatim, the later remark plugins add their copy button and title *inside* each
 * tab's section (this plugin runs first), and src/lib/splitCodeTabs.js reads the markers back
 * out of the rendered HTML. Readers of a page that renders the raw HTML just see the fences in
 * sequence.
 */

const PAIR = /([A-Za-z_][\w-]*)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;

const parseTabMeta = (meta) => {
  if (!meta) return null;
  const pairs = [...meta.matchAll(PAIR)];
  if (pairs.length === 0) return null;
  if (pairs.length > 1) {
    throw new Error(`gatsby-remark-code-tabs: one tab key per fence, but a fence has "${meta}"`);
  }
  const [, key, doubleQuoted, singleQuoted, bare] = pairs[0];
  return { key, value: doubleQuoted ?? singleQuoted ?? bare };
};

const html = (value) => ({ type: 'html', value });

const encode = encodeURIComponent;

function groupTabs(children) {
  const grouped = [];
  let group = null;

  const flush = () => {
    if (!group) return;
    grouped.push(html(`<!--code-tabs:${encode(group.key)}-->`));
    group.tabs.forEach(({ node, value }) => {
      grouped.push(html(`<!--code-tab:${encode(value)}-->`), node);
    });
    grouped.push(html('<!--/code-tabs-->'));
    group = null;
  };

  children.forEach((node) => {
    const tab = node.type === 'code' ? parseTabMeta(node.meta) : null;
    if (!tab) {
      flush();
      grouped.push(node);
      return;
    }
    if (group && group.key !== tab.key) flush();
    if (!group) group = { key: tab.key, tabs: [] };
    delete node.meta;
    group.tabs.push({ node, value: tab.value });
  });
  flush();

  return grouped;
}

function walk(node) {
  if (!Array.isArray(node.children)) return;
  if (node.children.some((child) => child.type === 'code' && child.meta)) {
    node.children = groupTabs(node.children);
  }
  node.children.forEach(walk);
}

module.exports = function gatsbyRemarkCodeTabs({ markdownAST }) {
  walk(markdownAST);
  return markdownAST;
};
