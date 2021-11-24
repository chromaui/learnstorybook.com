import React from 'react';
import ReactDOM from 'react-dom';
import { Spinner } from '@storybook/design-system';

const LOADING_ID = '___loading';

export const onRouteUpdateDelayed = () => {
  const loadingElement = document.createElement('div');
  loadingElement.id = LOADING_ID;
  loadingElement.style = 'position: fixed; bottom: 32px; right: 32px;';
  document.body.appendChild(loadingElement);

  ReactDOM.render(<Spinner />, document.getElementById(LOADING_ID));
};

export const onRouteUpdate = () => {
  const loadingElement = document.getElementById(LOADING_ID);

  if (!loadingElement) {
    return;
  }

  loadingElement.parentNode.removeChild(loadingElement);
};
