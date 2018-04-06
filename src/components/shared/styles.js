import { css } from 'styled-components';

export const color = {
  // Palette
  primary: '#1EA7FD',
  secondary: '#FC521F',
  tertiary: '#DDDDDD',
  ancillary: '#3C7384',

  app: '#f6f9fc',

  // Grayscale
  lightest: '#FFFFFF',
  lighter: '#F8F8F8',
  light: '#F3F3F3',
  mediumlight: '#EEEEEE',
  medium: '#DDDDDD',
  mediumdark: '#999999',
  dark: '#666666',
  darker: '#444444',
  darkest: '#333333',
};

export const spacing = {
  padding: {
    small: 10,
    medium: 20,
    large: 30,
  },
  borderRadius: {
    small: 5,
    default: 10,
  },
};

export const typography = {
  type: {
    primary: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    code: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },
  weight: {
    regular: '400',
    bold: '700',
    extrabold: '800',
  },
  size: {
    s1: '12',
    s2: '14',
    s3: '16',
    m1: '20',
    m2: '24',
    m3: '28',
    l1: '32',
    l2: '40',
    l3: '48',
    code: '90',
  },
};

export const breakpoint = '600';
export const pageMargin = '5.55555';

export const pageMargins = css`
  padding: 0 ${spacing.padding.medium}px;
  @media (min-width: ${breakpoint * 1}px) {
    margin: 0 ${pageMargin * 1}%;
  }
  @media (min-width: ${breakpoint * 2}px) {
    margin: 0 ${pageMargin * 2}%;
  }
  @media (min-width: ${breakpoint * 3}px) {
    margin: 0 ${pageMargin * 3}%;
  }
  @media (min-width: ${breakpoint * 4}px) {
    margin: 0 ${pageMargin * 4}%;
  }
`;

export const formatting = css`
  line-height: 1.65;
  font-size: 18px;

  h1,
  h2,
  h3,
  h4 {
    line-height: 1em;

    & + * {
      margin-top: 0 !important;
    }
  }

  h2:not(:first-child) {
    margin-top: 2em;
  }

  hr {
    margin: 3em 0;
  }

  hr + * {
    margin-top: 0 !important;
  }

  h1 {
    font-size: ${typography.size.l1}px;
    font-weight: ${typography.weight.extrabold};
    margin-bottom: 0.5em;
  }

  h2 {
    font-size: ${typography.size.m2}px;
    font-weight: ${typography.weight.extrabold};
    line-height: ${typography.size.m3}px;
    margin-bottom: 0.5em;
  }

  h3 {
    font-size: ${typography.size.m1}px;
    font-weight: ${typography.weight.extrabold};
    line-height: 28px;
    color: ${color.darkest};
    margin: 2em 0 0.5em;
  }

  h4 {
    font-size: ${typography.size.s3}px;
    font-weight: ${typography.weight.bold};
    color: ${color.dark};
    margin: 1.5em 0 0em;
  }

  p {
    margin: 1.5em 0;
    position: relative;

    &:first-of-type:not(:only-of-type) {
      margin-top: 0;
    }
    &:only-of-type {
      margin: 0;
    }
  }

  ol,
  ul {
    list-style-position: outside;
    margin-bottom: 1em;
    margin-top: 1em;
    padding-left: 30px;

    li {
      margin-bottom: 0.5em;
    }

    ul,
    ol {
      margin: 0.5em 0;
    }
  }

  ol {
    list-style-type: decimal;
  }
  ul {
    list-style-type: disc;
  }

  p a,
  li a,
  .aside a {
    color: ${color.primary};
    transition: all 250ms ease-out;
    display: inline-block;
    text-decoration: none;
    transform: translate3d(0, 0, 0);

    &:hover {
      cursor: pointer;
      transform: translate3d(0, -1px, 0);
    }

    &:active {
      transform: translate3d(0, 0, 0);
    }

    &:visited {
      color: ${color.primary};
    }
  }

  figure {
    clear: both;
    margin: 1em 0;

    figcaption {
      font-size: ${typography.size.s1}px;
    }
  }

  img {
    display: block;
    padding: 0;
    max-width: 100%;
    position: relative;
    vertical-align: top;
    margin: 0 auto;

    &.alignright {
      float: right;
      margin-right: 0;
    }

    &.alignleft {
      float: left;
      margin-left: 0;
    }

    &.aligncenter {
      display: block;
      margin-bottom: 1em;
      margin-left: auto;
      margin-right: auto;
      margin-top: 1em;
    }
  }
  .aside {
    font-size: ${typography.size.s3}px;
    color: ${color.dark};
    background: #fffad7;
    border-radius: 4px;
    padding: 20px;
  }

  /* Tables based on GH markdown format */
  table {
    font-size: ${typography.size.s2}px;
    padding: 0;
    border-collapse: collapse;
    width: 100%;
    margin: 2em 0;
  }
  table tr {
    border-top: 1px solid ${color.mediumlight};
    background-color: white;
    margin: 0;
    padding: 0;
  }
  table tr:nth-child(2n) {
    background-color: ${color.lighter};
  }
  table tr th {
    font-weight: bold;
    border: 1px solid ${color.medium};
    border-radius: 3px 3px 0 0;
    text-align: left;
    margin: 0;
    padding: 0.5em 0.75em;
  }
  table tr td {
    border: 1px solid #ddd;
    text-align: left;
    margin: 0;
    padding: 0.5em 1em;
  }

  table tr th :first-child,
  table tr td:first-child {
    margin-top: 0;
  }

  table tr th :last-child,
  table tr td:last-child {
    margin-bottom: 0;
  }

  iframe {
    border: none;
    width: 100% !important;
    max-width: none !important;
  }

  video {
    max-width: 100%;
    display: block;
    margin: 2em 0;
  }

  ${'' /* Tweak Prism styling */};
  *:not(pre) > code[class*='language-'],
  pre[class*='language-'] {
    background: ${color.lighter};
    margin: 2em 0;
  }

  code[class*='language-'],
  pre[class*='language-'] {
    font-size: ${typography.size.s3}px;
  }

  code {
    font-size: 17px;
  }

  .aside code {
    font-size: 15px;
  }
`;
