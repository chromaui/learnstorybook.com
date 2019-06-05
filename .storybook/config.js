import React from 'react';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { styles } from '@storybook/design-system';
import { GlobalStyle } from '../src/styles/global';
import 'storybook-chromatic';

addParameters({
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
});

// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
};

// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = '';

// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = pathname => {
  action('NavigateTo:')(pathname);
};

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

addDecorator(withA11y);

addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));
