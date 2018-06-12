'use strict';

const url = window.location.href;
const diff_matched = url.match(/merge_requests\/\d+/) !== null;

if (diff_matched) {
  diffAction();
} else {
  listAction(url);
}
console.log(`Hey! Welcome to GitlabEase!`);

// receive message
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.cmd == 'triggerFold') {
    foldFileRow();
    sendResponse('Fold action done!');
  }

  if (req.cmd == 'triggerFilter') {
    console.log('trigger filter event!');
    sendResponse('Filter action done!');
  }
});
