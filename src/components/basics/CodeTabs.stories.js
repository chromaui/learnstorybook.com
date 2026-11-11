import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chapterFormatting } from '../../styles/formatting';
import CodeTabs from './CodeTabs';

// The chapter's content styles, which give code titles and code blocks their look on the site.
const Content = styled.div`
  ${chapterFormatting};
`;

// What the remark plugins emit for a fence: the copy button (wired up by the code-buttons
// plugin's client entry, which .storybook/preview.js installs) and the highlighted code.
let toasterId = 0;
const snippet = (command) => {
  toasterId += 1;
  return `<div class="gatsby-code-button-container"><button type="button" class="gatsby-code-button" data-toaster-id="${toasterId}" aria-live="polite" onclick="copyToClipboard(\`${command}\`, \`${toasterId}\`)">Copy</button></div>
<pre><code class="language-sh">${command}</code></pre>`;
};

const packageManagerTabs = [
  { id: 'npm', html: snippet('npx storybook init') },
  { id: 'pnpm', html: snippet('pnpm dlx storybook init') },
  { id: 'yarn', html: snippet('yarn dlx storybook init') },
];

export default {
  component: CodeTabs,
  title: 'Basics/CodeTabs',
  decorators: [(story) => <Content>{story()}</Content>],
  args: {
    group: 'packageManager',
    tabs: packageManagerTabs,
  },
};

// The component is controlled, like a form field: the chapter decides the active tab from the
// reader's saved preference. The story holds that state itself.
function Controlled({ activeTab: initial, onChange, ...args }) {
  const [activeTab, setActiveTab] = useState(initial);
  return (
    <CodeTabs
      {...args}
      activeTab={activeTab}
      onChange={(id) => {
        setActiveTab(id);
        onChange(id);
      }}
    />
  );
}

Controlled.propTypes = {
  activeTab: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const Story = (args) => <Controlled {...args} onChange={action('onChange')} />;

export const Default = Story.bind({});
Default.args = { activeTab: 'npm' };

export const SecondTabActive = Story.bind({});
SecondTabActive.args = { activeTab: 'pnpm' };

export const WithCodeTitle = Story.bind({});
WithCodeTitle.args = {
  activeTab: 'npm',
  tabs: packageManagerTabs.map((tab) => ({
    ...tab,
    html: `<div class="gatsby-code-title">.github/workflows/chromatic.yml</div>\n${tab.html}`,
  })),
};

export const WithLabels = Story.bind({});
WithLabels.args = {
  group: 'framework',
  activeTab: 'react',
  tabs: [
    { id: 'react', label: 'React', html: snippet('npx create-react-app') },
    { id: 'react-native', label: 'React Native', html: snippet('npx react-native init') },
  ],
};

export const ClickingATab = Story.bind({});
ClickingATab.args = { activeTab: 'npm' };
ClickingATab.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('tab', { name: 'pnpm' }));

  await expect(canvas.getByRole('tab', { name: 'pnpm' })).toHaveAttribute('aria-selected', 'true');
  await expect(canvas.getByRole('tab', { name: 'npm' })).toHaveAttribute('aria-selected', 'false');
  await expect(canvas.getByRole('tabpanel')).toHaveTextContent('pnpm dlx storybook init');
  await expect(canvas.queryByText('npx storybook init')).not.toBeVisible();
};

export const KeyboardNavigation = Story.bind({});
KeyboardNavigation.args = { activeTab: 'npm' };
KeyboardNavigation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  canvas.getByRole('tab', { name: 'npm' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect(canvas.getByRole('tab', { name: 'pnpm' })).toHaveFocus();
  await expect(canvas.getByRole('tabpanel')).toHaveTextContent('pnpm dlx storybook init');

  await userEvent.keyboard('{End}');
  await expect(canvas.getByRole('tab', { name: 'yarn' })).toHaveFocus();
  await expect(canvas.getByRole('tabpanel')).toHaveTextContent('yarn dlx storybook init');

  // The strip wraps around, so the keyboard reaches every tab from any of them.
  await userEvent.keyboard('{ArrowRight}');
  await expect(canvas.getByRole('tab', { name: 'npm' })).toHaveFocus();
};

export const TabOrder = Story.bind({});
TabOrder.args = { activeTab: 'npm' };
TabOrder.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  canvas.getByRole('tab', { name: 'npm' }).focus();
  await userEvent.tab();

  // The panel is not a stop of its own: Tab goes straight to the visible tab's copy button.
  await expect(canvas.getByRole('button', { name: 'Copy' })).toHaveFocus();
  await expect(canvas.getByRole('tabpanel')).not.toHaveAttribute('tabindex');
};

export const CopyingTheActiveTab = Story.bind({});
CopyingTheActiveTab.args = { activeTab: 'npm' };
CopyingTheActiveTab.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', { name: 'Copy' });
  await userEvent.click(button);

  await expect(button).toHaveTextContent('Copied');
  await expect(button).toHaveClass('copied');
  await expect(button.querySelector('svg')).toBeInTheDocument();
  await expect(button).toHaveFocus();

  // Then it goes back to offering a copy.
  await waitFor(() => expect(button).toHaveTextContent(/^\s*Copy\s*$/), { timeout: 5000 });
  await expect(button).not.toHaveClass('copied');
};

const rect = (element) => element.getBoundingClientRect();
const overlap = (a, b) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

export const CopyButtonPlacement = Story.bind({});
CopyButtonPlacement.args = { activeTab: 'npm' };
CopyButtonPlacement.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = rect(canvas.getByRole('button', { name: 'Copy' }));
  const code = rect(canvasElement.querySelector('[role=tabpanel]:not([hidden]) pre'));
  const strip = rect(canvas.getByRole('tablist'));

  // The button lives in the tab strip's row, never over the code.
  await expect(overlap(button, code)).toBe(false);
  await expect(button.top).toBeGreaterThanOrEqual(strip.top);
  await expect(button.bottom).toBeLessThanOrEqual(strip.bottom);
};

export const CopyButtonPlacementWithCodeTitle = Story.bind({});
CopyButtonPlacementWithCodeTitle.args = WithCodeTitle.args;
CopyButtonPlacementWithCodeTitle.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const panel = canvasElement.querySelector('[role=tabpanel]:not([hidden])');
  const button = rect(canvas.getByRole('button', { name: 'Copy' }));
  const code = rect(panel.querySelector('pre'));
  const title = rect(panel.querySelector('.gatsby-code-title'));

  // A titled tab keeps its button in the title bar's row.
  await expect(overlap(button, code)).toBe(false);
  await expect(button.top).toBeGreaterThanOrEqual(title.top);
  await expect(button.bottom).toBeLessThanOrEqual(title.bottom);
};
