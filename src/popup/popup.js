// query to get the elements
const tabTitleContent = document.getElementById('tab_title');
const tabResizeInput = document.getElementById('tab_resize');

const foldCheckbox = document.getElementById('fold_check');
const foldClickButton = document.getElementById('fold_click');

// render data
const renderTabSizeBar = () => {
  let size = tabResizeInput.value;
  tabTitleContent.innerText = `Customized Tab Size: ${size}`;
  chrome.storage.local.set({ tabSize: size });
};

const renderFoldCheckbox = () => {
  let foldCheck = foldCheckbox.checked;
  chrome.storage.local.set({ autoFold: foldCheck });
};

// event bind
tabResizeInput.addEventListener('input', renderTabSizeBar);
foldCheckbox.addEventListener('input', renderFoldCheckbox);

// for initialize use
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(
    {
      tabSize: 4,
      autoFold: true
    },
    data => {
      tabResizeInput.value = data.tabSize;
      foldCheckbox.checked = data.autoFold;

      renderTabSizeBar();
      renderFoldCheckbox();
    }
  );
});

// process click event
foldClickButton.addEventListener(
  'click',
  e => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: 'triggerFold' }, resp => {
        console.log('Response: ', resp);
      });
    });
    e.preventDefault();
  },
  false
);
