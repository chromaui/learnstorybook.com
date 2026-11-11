import React from 'react';
import { styled } from '@storybook/theming';
import { expect, userEvent, within } from 'storybook/test';
import { chapterFormatting } from '../../../styles/formatting';
import ChapterBody from './ChapterBody';

// The chapter screen's content column, so prose, code titles and code blocks look as they do on
// the site.
const Content = styled.div`
  ${chapterFormatting};
  max-width: 800px;
  margin: 0 auto;
`;

// What gatsby-transformer-remark produces for two tabbed snippets of the same group, as written
// in content/ai-ready-design-systems/react/en/get-started.md.
let toasterId = 0;
const fence = (command) => {
  toasterId += 1;
  return `<div class="gatsby-code-button-container"><button type="button" class="gatsby-code-button" data-toaster-id="${toasterId}" aria-live="polite" onclick="copyToClipboard(\`${command}\`, \`${toasterId}\`)">Copy</button></div>
<pre><code class="language-sh">${command}</code></pre>`;
};
const tabbedSnippet = (commands) =>
  Object.entries(commands)
    .map(([packageManager, command]) => `<!--code-tab:${packageManager}-->\n${fence(command)}`)
    .join('\n');

const html = `<p>If you don't use Storybook yet, you can install it with the following command:</p>
<!--code-tabs:packageManager-->
${tabbedSnippet({
  npm: 'npx storybook init',
  pnpm: 'pnpx --allow-build=esbuild storybook init',
  yarn: 'yarn exec storybook init',
})}
<!--/code-tabs-->
<p>As the install progresses, Storybook will offer to install its skills for you. If you want to install skills for another agent later, you can use <a href="https://github.com/vercel-labs/skills">the <code>skills</code> package</a>:</p>
<!--code-tabs:packageManager-->
${tabbedSnippet({
  npm: 'npx skills add storybookjs/skills --yes',
  pnpm: 'pnpx --allow-build=esbuild skills add storybookjs/skills --yes',
  yarn: 'yarn exec skills add storybookjs/skills --yes',
})}
<!--/code-tabs-->
<p>A plain fence is unaffected:</p>
${fence('git init')}
<p>A fence with a title gets a title bar:</p>
<div class="gatsby-code-title">.storybook/main.js</div>
${fence("export default { stories: ['../src/**/*.stories.js'] };")}
<p>And that is the end of the chapter.</p>`;

export default {
  component: ChapterBody,
  title: 'Screens/ChapterScreen/ChapterBody',
  decorators: [(story) => <Content>{story()}</Content>],
  args: { html },
  // Each story starts from a clean slate, whatever an earlier story saved.
  beforeEach: () => {
    window.localStorage.clear();
  },
};

const Story = (args) => <ChapterBody {...args} />;

export const Default = Story.bind({});

export const PlainHtml = Story.bind({});
PlainHtml.args = {
  html: `<p>No tabbed snippets here.</p>\n${fence('git init')}`,
};

export const GroupsStayInSync = Story.bind({});
GroupsStayInSync.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const [firstYarn] = canvas.getAllByRole('tab', { name: 'yarn' });
  await userEvent.click(firstYarn);

  const yarnTabs = canvas.getAllByRole('tab', { name: 'yarn' });
  await expect(yarnTabs).toHaveLength(2);
  yarnTabs.forEach((tab) => expect(tab).toHaveAttribute('aria-selected', 'true'));
  const panels = canvas.getAllByRole('tabpanel');
  await expect(panels[0]).toHaveTextContent('yarn exec storybook init');
  await expect(panels[1]).toHaveTextContent('yarn exec skills add');

  // The choice is what the next chapter, and the next visit, start from.
  await expect(window.localStorage.getItem('learnstorybook.codeTabs.packageManager')).toBe('yarn');
};

const rect = (element) => element.getBoundingClientRect();
const overlap = (a, b) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

export const CopyButtonPlacement = Story.bind({});
CopyButtonPlacement.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const buttons = canvas.getAllByRole('button', { name: 'Copy' });
  await expect(buttons).toHaveLength(4);

  // No copy button covers its code block.
  buttons.forEach((button) => {
    const code = button.closest('.gatsby-code-button-container').nextElementSibling;
    expect(code.tagName).toBe('PRE');
    expect(overlap(rect(button), rect(code))).toBe(false);
  });

  // A titled fence's button sits in the title bar's row.
  const title = rect(canvas.getByText('.storybook/main.js'));
  const titled = rect(buttons[3]);
  await expect(titled.top).toBeGreaterThanOrEqual(title.top);
  await expect(titled.bottom).toBeLessThanOrEqual(title.bottom);
};
