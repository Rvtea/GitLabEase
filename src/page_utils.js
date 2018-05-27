'use strict';

// common used func
function isPageLoading() {
  // check if loading status div is still display or not
  let loading_ele = document.getElementsByClassName('mr-loading-status');

  // if element not found, then page is still loading
  if (!loading_ele) {
    return true;
  }

  let loading = loading_ele[0].getElementsByTagName('div')[0].style.display;

  return loading != 'none';
}

function foldFileRow() {
  // probably customized in the future, such as '_spec', '__test__', etc
  // if this part become an array, then code below need enhancement
  const regexpPlan = ['test', 'spec'];

  // loop the files first
  let diffFiles = document.querySelectorAll('.diff-file, .file-holder');
  for (let idx = 0; idx < diffFiles.length; idx++) {
    const ele = diffFiles[idx];
    const fileName = ele.getAttribute('data-blob-diff-path');
    if (
      regexpPlan.reduce(
        (matchRe, item) => matchRe || fileName.match(item) !== null,
        false
      )
    ) {
      // judge if the file is alreadyed folded
      let displayed = ele.getElementsByClassName('diff-content')[0].style
        .display;

      if (displayed !== 'none') {
        // if matched, then automatically click to fold the opened file.
        ele.getElementsByClassName('js-file-title')[0].click();
      }
    }
  }
}
