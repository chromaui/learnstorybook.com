require('./styles.css');

exports.onClientEntry = () => {
  window.copyToClipboard = (str, toasterId) => {
    const el = document.createElement('textarea');
    el.className = 'gatsby-code-button-buffer';
    el.innerHTML = str;
    document.body.appendChild(el);
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    document.activeElement.blur();

    const copyButton = document.querySelector(`[data-toaster-id="${toasterId}"]`);
    copyButton.style.backgroundColor = 'pink';
    const previousText = copyButton.innerText;
    copyButton.innerText = 'Copied';
    copyButton.style.pointerEvents = 'none';

    setTimeout(() => {
      document.getSelection().removeAllRanges();
      document.body.removeChild(el);
    }, 100);

    setTimeout(() => {
      copyButton.innerText = previousText;
      copyButton.style.backgroundColor = 'rgb(248, 248, 248)';
      copyButton.style.pointerEvents = 'initial';
    }, 3500);
  };
};
