import React from 'react';
import { createRoot } from 'react-dom/client';
import { Spinner } from '@storybook/design-system';

export { default as wrapRootElement } from './src/wrap-root-element';

const LOADING_ID = '___loading';
let loadingRoot = null;

export const onRouteUpdateDelayed = () => {
  const loadingElement = document.createElement('div');
  loadingElement.id = LOADING_ID;
  loadingElement.style = 'position: fixed; bottom: 32px; right: 32px;';
  document.body.appendChild(loadingElement);

  loadingRoot = createRoot(loadingElement);
  loadingRoot.render(<Spinner />);
};

export const onRouteUpdate = () => {
  const loadingElement = document.getElementById(LOADING_ID);

  if (!loadingElement) {
    return;
  }

  loadingRoot?.unmount();
  loadingRoot = null;
  loadingElement.parentNode.removeChild(loadingElement);
};
