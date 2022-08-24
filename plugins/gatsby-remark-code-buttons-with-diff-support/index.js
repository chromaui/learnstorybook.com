/* eslint-disable import/no-extraneous-dependencies */
const visit = require('unist-util-visit');
const qs = require('query-string');

module.exports = function gatsbyRemarkCodeButtons({ markdownAST }) {
  visit(markdownAST, 'code', (node, index, parent) => {
    const [language, params] = (node.lang || '').split(':');
    const actions = qs.parse(params);
    const { clipboard } = actions;

    if (!language) {
      return;
    }

    if (clipboard === 'false') {
      delete actions.clipboard;
    } else {
      const buttonClass = ['gatsby-code-button'];
      const buttonText = 'Copy';
      const toasterText = 'Copied';
      const toasterId = toasterText ? Math.random() * 100 ** 10 : '';

      let code = parent.children[index].value;
      if (language === 'diff') {
        code = code.replace(/^-(.*)(\r\n|\n|\r)/gm, '').replace(/^\+(.*)$/gm, '$1');
      }
      code = code.replace(/"/gm, '&quot;').replace(/`/gm, '\\`').replace(/\$/gm, '\\$');

      const buttonNode = {
        type: 'html',
        value: `
            <div
              class="gatsby-code-button-container"
              onClick="copyToClipboard(\`${code}\`, \`${toasterId}\`)"
            >
              <div
                class="${buttonClass}"
                data-toaster-id="${toasterId}"
              >
                ${buttonText} 
              </div>
            </div>
            `.trim(),
      };

      parent.children.splice(index, 0, buttonNode);
      actions.clipboard = 'false';
    }

    let newQuery = '';
    if (Object.keys(actions).length) {
      newQuery = `:${Object.keys(actions)
        .map((key) => `${key}=${actions[key]}`)
        .join('&')}`;
    }

    // eslint-disable-next-line no-param-reassign
    node.lang = language + newQuery;
  });
};
