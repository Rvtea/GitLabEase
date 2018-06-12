/*
  This file is used to handle URL like: https://git.yourdomain/yourrepo/merge_requests/12345[/diffs]
  * this url aims to MR diff page usage
  * this script will looping till diff page rendered.
*/
'use strict';

const diffAction = () => {
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

  // initialize
  var autoFold = false;
  chrome.storage.local.get(
    { autoFold: false },
    data => (autoFold = data.autoFold)
  );
  chrome.storage.local.get({ tabSize: 2 }, data => setTabSize(data.tabSize));

  // storage onChanged event
  // onChanged will return { newValue: x, oldValue: y }
  chrome.storage.onChanged.addListener(data => {
    if (data.tabSize) {
      setTabSize(data.tabSize.newValue);
    }
  });
};

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

const foldFileRow = () => {
  // probably customized in the future, such as '_spec', '__test__', etc
  // if this part become an array, then code below need enhancement
  const regexpPlan = ['test', 'spec', '.pb.go', '.pb.gw.go', '.swagger.json'];

  // loop the files
  let diffFiles = document.querySelectorAll('.diff-file, .file-holder');
  let plan_element_list = [];
  let full_plan = true;
  let [total_diff_count, total_fold_count] = [diffFiles.length, 0];

  for (let idx = 0; idx < total_diff_count; idx++) {
    const ele = diffFiles[idx];

    if (ele.className === 'diff-file file-holder') {
      const fileName = ele.getAttribute('data-blob-diff-path');
      if (
        regexpPlan.reduce(
          (matchRe, item) => matchRe || fileName.match(item) !== null,
          false
        )
      ) {
        plan_element_list.push(ele);
      } else {
        // otherwise exist files not in plan, then we should fold planned files, fix issue #5
        full_plan = false;
      }
    }
  }

  // loop to fold planned files if exist other file
  if (!full_plan) {
    total_fold_count = plan_element_list.length;
    for (let idx = 0; idx < total_fold_count; idx++) {
      const element = plan_element_list[idx];

      // judge if the file is alreadyed folded, use click-to-expand as it exist all the time
      if (isDiffDetailsRendered(element)) {
        // if matched, then automatically click to fold the opened file.
        element.getElementsByClassName('js-file-title')[0].click();
      }
    }
  }

  // show stats
  diffPageStats(total_diff_count, total_fold_count);
};

const isDiffDetailsRendered = element => {
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
};

// Log in console to provide a simple stats
const diffPageStats = (diff_num, fold_num) => {
  const stats = {
    'Total Files': diff_num,
    'Folded Files': fold_num
  };
  console.table(stats);
};
