import React from 'react';
import PropTypes from 'prop-types';
import { CodeTabPreferencesProvider } from './components/composite/CodeTabPreferences';

// Gatsby's wrapRootElement, shared by gatsby-browser.js and gatsby-ssr.js so the server and the
// client render the same tree.
export default function wrapRootElement({ element }) {
  return <CodeTabPreferencesProvider>{element}</CodeTabPreferencesProvider>;
}

wrapRootElement.propTypes = {
  element: PropTypes.node.isRequired,
};
