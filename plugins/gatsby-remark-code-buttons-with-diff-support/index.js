const visit = require('unist-util-visit');

module.exports = function gatsbyRemarkCodeButtons({ markdownAST }) {
  visit(markdownAST, 'code', (node, index, parent) => {
    const [language, params] = (node.lang || '').split(':');
    const actions = Object.fromEntries(new URLSearchParams(params));
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

      // A real button, so the keyboard reaches it; aria-live lets screen readers hear "Copied".
      const buttonNode = {
        type: 'html',
        value: `
            <div class="gatsby-code-button-container">
              <button
                type="button"
                class="${buttonClass}"
                data-toaster-id="${toasterId}"
                aria-live="polite"
                onclick="copyToClipboard(\`${code}\`, \`${toasterId}\`)"
              >
                ${buttonText}
              </button>
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

    node.lang = language + newQuery;
  });
};
