/*
  This file is used to handle URL like: https://git.yourdomain/yourrepo/merge_requests/12345[/diffs]
  * this url aims to MR diff page usage
  * this script will looping till diff page rendered.
*/

var autoFold = false;
chrome.storage.local.get(
  { autoFold: false },
  data => (autoFold = data.autoFold)
);

// inject css
const extraStyle = document.createElement('style');
document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(extraStyle);
  foldRow(autoFold);
});

// per https://gitlab.com/gitlab-org/gitlab-ce/issues/2479
const setTabSize = tabSize =>
  (extraStyle.innerHTML = `
.line {
	-moz-tab-size: ${tabSize} !important;
	     tab-size: ${tabSize} !important;
}`);

const foldRow = autoFold => {
  var checkTimer = setInterval(checkLoading, 150);

  function checkLoading() {
    // only work when page stop loading & rendering
    if (!isPageLoading()) {
      clearInterval(checkTimer);

      if (autoFold) {
        foldFileRow();
      }
    }
  }
};

// initialize
chrome.storage.local.get({ tabSize: 2 }, data => setTabSize(data.tabSize));

// onChanged will return { newValue: x, oldValue: y }
chrome.storage.onChanged.addListener(data => {
  if (data.tabSize) {
    setTabSize(data.tabSize.newValue);
  }
});

// receive message
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.cmd == 'triggerFold') foldFileRow();
  sendResponse('Fold action done!');
});
