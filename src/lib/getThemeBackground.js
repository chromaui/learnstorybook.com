import * as gradients from '../styles/gradients.js';

// Resolves the CSS background for a guide: the gradient named by `themeGradientName` when it
// exists, otherwise the solid `themeColor`. Unknown names fall back rather than break the page.
export default function getThemeBackground({ themeColor, themeGradientName }) {
  const gradient = themeGradientName ? gradients[themeGradientName] : undefined;
  return typeof gradient === 'string' ? gradient : themeColor;
}
