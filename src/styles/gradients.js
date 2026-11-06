// Guide themes that cannot be expressed as a single color. A guide opts in with the
// `themeGradientName` frontmatter field, which names one of these exports; `themeColor`
// stays required as the solid fallback.

// Deep orange into raspberry: Storybook's coral and pink, each one step deeper so white text
// holds up on the card. No gold stop, which would read brown in the card's top corner.
export const sunrise = 'linear-gradient(135deg, #EA580C 0%, #DB2777 100%)';

// Dark alternative: pink and blue blobs in the corners over a navy base, in the spirit of
// storybook.js.org's AI hero. Pair it with a light badge rather than the dark one.
export const aiAurora = `
  radial-gradient(80% 60% at 105% -5%, rgba(255, 71, 133, 0.55), transparent 75%),
  radial-gradient(80% 60% at -5% 105%, rgba(31, 133, 252, 0.6), transparent 75%),
  radial-gradient(60% 50% at 70% 85%, rgba(252, 81, 31, 0.25), transparent 75%),
  linear-gradient(160deg, #0B1630 0%, #1A1440 60%, #241046 100%)
`;
