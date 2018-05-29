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
  const regexpPlan = ['test', 'spec', '.pb.go', '.pb.gw.go', '.swagger.json'];

  // loop the files first
  let diffFiles = document.querySelectorAll('.diff-file, .file-holder');
  for (let idx = 0; idx < diffFiles.length; idx++) {
    const ele = diffFiles[idx];

    if (ele.className === 'diff-file file-holder') {
      const fileName = ele.getAttribute('data-blob-diff-path');
      if (
        regexpPlan.reduce(
          (matchRe, item) => matchRe || fileName.match(item) !== null,
          false
        )
      ) {
        // judge if the file is alreadyed folded, use click-to-expand as it exist all the time
        if (isDiffDetailsRendered(ele)) {
          // if matched, then automatically click to fold the opened file.
          ele.getElementsByClassName('js-file-title')[0].click();
        }
      }
    }
  }
}

function isDiffDetailsRendered(element) {
  let clickToExpand = element.getElementsByClassName('click-to-expand')[0];
  let parentEle;
  if (clickToExpand.parentElement.className === 'diff-content') {
    parentEle = clickToExpand.parentElement;
  } else {
    let tmp = clickToExpand.parentElement.parentElement;
    if (tmp.className === 'diff-content') {
      parentEle = tmp;
    } else if (tmp.parentElement.className === 'diff-content') {
      parentEle = tmp.parentElement;
    }
  }

  if (parentEle) {
    let displayed = parentEle.style.display;
    if (displayed == 'none' || displayed !== '') {
      return true;
    }
  }
  return false;
}
