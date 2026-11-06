import React from 'react';
import { action } from 'storybook/actions';
import {
  global as designSystemGlobal,
  loadFontsForStorybook,
  styles,
} from '@storybook/design-system';

const { GlobalStyle } = designSystemGlobal;

// Gatsby's Link is replaced by .storybook/gatsby-mock.js, whose anchors report the path they
// would navigate to through this global instead of leaving the story.
window.___navigate = (pathname) => {
  action('NavigateTo:')(pathname);
};

loadFontsForStorybook();

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
