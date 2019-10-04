const React = require('react');
const ReactDOM = require('react-dom');
const { Spinner } = require('@storybook/design-system');

const LOADING_ID = '___loading';

exports.onRouteUpdateDelayed = () => {
  const loadingElement = document.createElement('div');
  loadingElement.id = LOADING_ID;
  loadingElement.style = 'position: fixed; bottom: 32px; right: 32px;';
  document.body.appendChild(loadingElement);

  ReactDOM.render(<Spinner />, document.getElementById(LOADING_ID));
};

exports.onRouteUpdate = () => {
  const loadingElement = document.getElementById(LOADING_ID);

  if (!loadingElement) {
    return;
  }

  loadingElement.parentNode.removeChild(loadingElement);
};
