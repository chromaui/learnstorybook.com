/* eslint-disable import/no-extraneous-dependencies */
const visit = require('unist-util-visit');

const cheerio = require(`cheerio`);

function formatHtml(node, pathPrefix, withPrefix) {
  const $ = cheerio.load(node.value);

  function processUrl(url) {
    try {
      const link = withPrefix(url);
      // eslint-disable-next-line
      node.value = node.value.replace(new RegExp(`(?<!${pathPrefix})${url}`, `g`), link);
    } catch (err) {
      // Ignore
    }
  }

  // extracts all elements that have the provided url attribute
  function extractUrlAttribute(selection, attribute) {
    return (
      selection
        // extract the elements that have the attribute
        // eslint-disable-next-line
        .map(function() {
          const url = $(this).attr(attribute);

          if (url && url.startsWith(`/`)) {
            return url;
          }
          return undefined;
        })
        // cheerio object -> array
        .toArray()
        // filter out empty or undefined values
        .filter(Boolean)
    );
  }

  // Handle Images
  extractUrlAttribute($(`img[src]`), `src`).forEach(processUrl);

  // Handle video tags
  extractUrlAttribute($(`video source[src], video[src]`), `src`).forEach(processUrl);

  // Handle video poster
  extractUrlAttribute($(`video[poster]`), `poster`).forEach(processUrl);

  // Handle audio tags
  extractUrlAttribute($(`audio source[src], audio[src]`), `src`).forEach(processUrl);

  // Handle source tags with line breaks before them
  extractUrlAttribute($(`source[src]`), `src`).forEach(processUrl);

  // Handle flash embed tags
  extractUrlAttribute($(`object param[value]`), `value`).forEach(processUrl);

  // Handle a tags
  extractUrlAttribute($(`a[href]`), `href`).forEach(processUrl);
}

/**
 * A Remark Transformer Plugin that adds pathPrefix to
 * - Relative urls in HTML inside markdown.
 * - Images referenced from the static directory
 *
 * Why do we need this?
 * Because gatsby-transformer-remark doesn't transform HTML
 * inside markdown. And gatsby-remark-images doesn't transform
 * images coming from the static folder
 */
module.exports = function gatsbyRemarkPrefixLinks({ markdownAST, pathPrefix }) {
  function withPrefix(path) {
    if (path.startsWith(`/`) && !path.startsWith(pathPrefix)) {
      return pathPrefix + path;
    }

    return path;
  }

  visit(markdownAST, ['image', 'html'], (node) => {
    if (!node) return;

    switch (node.type) {
      case 'image': {
        // eslint-disable-next-line
        node.url = withPrefix(node.url);
        return;
      }
      case 'html': {
        formatHtml(node, pathPrefix, withPrefix);
        return;
      }
      default:
        throw new Error(`Unexpected: ${node.type}`);
    }
  });

  return markdownAST;
};
/* eslint-enable import/no-extraneous-dependencies */
