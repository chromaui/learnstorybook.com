import * as React from 'react';
import {
  global as designSystemGlobal,
  loadFontsForStorybook,
  styles,
} from '@storybook/design-system';

const { GlobalStyle } = designSystemGlobal;

export const parameters = {
  options: { panelPosition: 'bottom' },
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
};

// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
};

// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = '';
global.__BASE_PATH__ = '';

export const decorators = [
  (story) => (
    <>
      <GlobalStyle />
      {story()}
    </>
  ),
];

loadFontsForStorybook();
