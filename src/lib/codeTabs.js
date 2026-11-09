// Reads the tab groups that plugins/gatsby-remark-code-tabs marked up out of a chapter's rendered
// HTML, so the chapter can render each group with the CodeTabs component and the rest with the
// design system's Highlight. The markers are HTML comments:
//
//   <!--code-tabs:GROUP--> <!--code-tab:ID--> ...html... <!--code-tab:ID--> ...html... <!--/code-tabs-->
//
// GROUP and ID are URI-encoded by the plugin.

const GROUP_START = /<!--code-tabs:([^>]*?)-->/;
const GROUP_END = '<!--/code-tabs-->';
const TAB = /<!--code-tab:([^>]*?)-->/;

const parseTabs = (body) => {
  // Splitting on a capturing group interleaves the ids with the html that follows each marker.
  const [, ...parts] = body.split(TAB);
  const tabs = [];
  for (let i = 0; i < parts.length; i += 2) {
    tabs.push({ id: decodeURIComponent(parts[i]), html: parts[i + 1].trim() });
  }
  return tabs;
};

/**
 * @param {string} html
 * @returns {Array<{type: 'html', html: string} | {type: 'tabs', group: string, tabs: Array<{id: string, html: string}>}>}
 */
export function splitCodeTabs(html) {
  const segments = [];
  const pushHtml = (chunk) => {
    const trimmed = chunk.trim();
    if (trimmed) segments.push({ type: 'html', html: trimmed });
  };

  let rest = html;
  for (;;) {
    const start = GROUP_START.exec(rest);
    if (!start) {
      pushHtml(rest);
      return segments;
    }
    pushHtml(rest.slice(0, start.index));
    const afterStart = rest.slice(start.index + start[0].length);
    const end = afterStart.indexOf(GROUP_END);
    if (end === -1) {
      // An unterminated group cannot come from the plugin; show the rest as it is.
      pushHtml(afterStart);
      return segments;
    }
    segments.push({
      type: 'tabs',
      group: decodeURIComponent(start[1]),
      tabs: parseTabs(afterStart.slice(0, end)),
    });
    rest = afterStart.slice(end + GROUP_END.length);
  }
}

/**
 * The tab to show for a group: the reader's saved choice when the group offers it, else the
 * first tab. A group that lacks the saved choice must not overwrite it, so this only reads.
 */
export const pickActiveTab = (tabs, preferred) =>
  tabs.some((tab) => tab.id === preferred) ? preferred : (tabs[0]?.id ?? null);
