import React from 'react';
import { action } from 'storybook/actions';
import {
  global as designSystemGlobal,
  loadFontsForStorybook,
  styles,
} from '@storybook/design-system';
import { onClientEntry as installCopyButtons } from '../plugins/gatsby-remark-code-buttons-with-diff-support/gatsby-browser';

const { GlobalStyle } = designSystemGlobal;

// Gatsby's Link is replaced by .storybook/gatsby-mock.js, whose anchors report the path they
// would navigate to through this global instead of leaving the story.
window.___navigate = (pathname) => {
  action('NavigateTo:')(pathname);
};

loadFontsForStorybook();

// The copy button on code blocks is static HTML from the remark plugin, wired up and styled by the
// plugin's client entry. Run it here as Gatsby does, so snippets in stories behave like the site.
installCopyButtons();

export default {
  parameters: {
    viewport: {
      viewports: [
        {
          name: 'Design system breakpoint',
          styles: {
            width: `${styles.breakpoint - 1}px`,
            height: '768px',
          },
        },
      ],
    },
  },
  decorators: [
    (story) => (
      <>
        <GlobalStyle />
        {story()}
      </>
    ),
  ],
};
