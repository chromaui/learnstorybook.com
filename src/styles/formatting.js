import { css } from 'styled-components';
import { styles } from '@storybook/design-system';

const { color, typography } = styles;

export const guideFormatting = css`
  h1 {
    font-size: ${typography.size.m2}px;
    font-weight: ${typography.weight.black};
    line-height: 36px;
  }
`;

export const chapterFormatting = css`
  line-height: 26px;
  font-size: ${typography.size.s3};

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

  h2 {
    font-size: ${typography.size.m1}px;
    font-weight: ${typography.weight.black};
    line-height: ${typography.size.m3}px;
    letter-spacing: -0.6px;
    margin-bottom: 0.5em;
  }

  h3 {
    font-size: ${typography.size.m1}px;
    font-weight: ${typography.weight.black};
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
    letter-spacing: -0.37px;

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
    color: ${color.secondary};
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
      color: ${color.secondary};
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
    font-size: ${typography.size.s2}px;
  }

  code {
    font-size: ${typography.size.s3 - 1}px;
  }

  .aside code {
    font-size: 15px;
  }
`;
