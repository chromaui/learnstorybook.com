import './styles.css';

// The check icon from @storybook/icons, as the Storybook docs show it once a snippet is copied.
const CHECK_ICON =
  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M13.854 3.354a.5.5 0 00-.708-.708L5 10.793.854 6.646a.5.5 0 10-.708.708l4.5 4.5a.5.5 0 00.708 0l8.5-8.5z" fill="currentColor"/></svg>';

const COPIED_FOR_MS = 3500;

// The copy buttons are static HTML emitted by index.js, so they call this global.
export const onClientEntry = () => {
  window.copyToClipboard = (str, toasterId) => {
    const buffer = document.createElement('textarea');
    buffer.className = 'gatsby-code-button-buffer';
    buffer.innerHTML = str;
    document.body.appendChild(buffer);
    const range = document.createRange();
    range.selectNode(buffer);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');

    const button = document.querySelector(`[data-toaster-id="${toasterId}"]`);
    // Remembered once, so a second activation while "Copied" shows cannot make that the idle label.
    button.dataset.idleLabel ??= button.innerHTML;
    button.classList.add('copied');
    button.innerHTML = `${CHECK_ICON} Copied`;
    // Keep keyboard users where they were.
    button.focus();

    setTimeout(() => {
      document.getSelection().removeAllRanges();
      document.body.removeChild(buffer);
    }, 100);

    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = button.dataset.idleLabel;
    }, COPIED_FOR_MS);
  };
};
