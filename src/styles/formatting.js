import { css } from 'styled-components';
import { styles } from '@storybook/design-system';
import { darken, rgba } from 'polished';

require(`prismjs/components/prism-diff`);

const { background, color, typography } = styles;

export const guideFormatting = css`
  h1 {
    font-size: ${typography.size.m2}px;
    font-weight: ${typography.weight.black};
    line-height: 36px;
  }

  p {
    line-height: 28px;
  }

  img {
    display: block;
    padding: 0;
    max-width: 100%;
    position: relative;
    margin: 0 auto;
  }

  .badge-box {
    margin-top: 18px;
    margin-bottom: 24px;
  }
  .badge {
    display: inline-flex;
    vertical-align: top;
    margin-bottom: 10px;
    align-items: center;
    background: ${background.app};
    border-radius: ${styles.spacing.borderRadius.small}px;
    padding: 3px 20px;
    font-size: ${typography.size.s2}px;
    line-height: 24px;
    margin-right: 6px;
    position: relative;
    border: 1px solid transparent;
    transition: border 0.3s ease-in-out;

    &:last-of-type {
      margin-right: 0;
    }

    img {
      width: 16px;
      margin-right: 6px;
    }
    & a {
      color: ${styles.color.darker};
      transition: all 250ms ease-out;
      display: inline-block;
      text-decoration: none;
    }
    &:after {
      content: '';
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      box-shadow: rgba(0, 0, 0, 0.08) 0 3px 10px 0;
    }
  }
`;

export const chapterFormatting = css`
  line-height: 28px;
  font-size: ${typography.size.s3}px;

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
    font-size: ${typography.size.m2}px;
    font-weight: ${typography.weight.extrabold};
    line-height: ${typography.size.m3}px;
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
    font-weight: ${typography.weight.extrabold};
    margin: 1.5em 0 0.5em;
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
      margin-bottom: 0.25em;
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
    color: purple;
    transition: all 250ms ease-out;
    display: inline-block;
    text-decoration: none;
    transform: translate3d(0, 0, 0);

    &,
    &:hover,
    &:focus,
    &:hover:focus {
      color: ${darken(0.2, color.secondary)};
    }

    &:hover {
      text-decoration: underline;
      transform: translate3d(0, -1px, 0);
    }

    &:active {
      transform: translate3d(0, 0, 0);
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
    color: ${color.darker};
    background: #f8fafc;
    border-radius: ${styles.spacing.borderRadius.small}px;
    padding: 20px;

    p:last-child {
      margin-bottom: 0;
    }
  }
  .translation-aside {
    font-size: ${typography.size.s3}px;
    color: ${color.darker};
    background: #f8fafc;
    border-radius: ${styles.spacing.borderRadius.small}px;
    padding: 20px;
    margin-bottom: 1.5rem;
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
    line-height: ${typography.size.m1}px;
  }

  code {
    font-size: ${typography.size.s3 - 2}px;
  }

  .aside code {
    font-size: ${typography.size.s3 - 2}px;
  }

  .gatsby-code-title {
    margin-top: 2em;
    border-bottom: 1px solid ${color.border};
    padding: 1rem;
    font-size: ${typography.size.s3 - 2}px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    line-height: 1;
    background: ${color.lighter};
    color: ${color.mediumdark};
  }

  .gatsby-code-title + pre[class*='language-'] {
    margin-top: 0;
  }

  blockquote {
    font-size: ${typography.size.m1}px;
    color: ${color.mediumdark};
    line-height: 1.75;
    margin-top: 2rem;
    margin-bottom: 2.5rem;
  }
`;
