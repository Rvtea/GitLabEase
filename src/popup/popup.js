// query to get the elements
const tabTitleContent = document.getElementById('tab-title');
const tabResizeInput = document.getElementById('tab-resize');

const foldCheckbox = document.getElementById('fold-check');
// const foldClickButton = document.getElementById('fold-click');

const filterCheckbox = document.getElementById('filter-check');
// const filterClickButton = document.getElementById('filter-click');
const filterRadios = document.querySelectorAll('input[name="filter"]');

// render data
const setTabSizeBar = size => {
  tabResizeInput.value = size;
  tabTitleContent.innerText = `Customized Tab Size: ${size}`;
  chrome.storage.local.set({ tabSize: size });
};

const setFoldCheckbox = foldCheck => {
  foldCheckbox.checked = foldCheck;
  chrome.storage.local.set({ autoFold: foldCheck });
};

const setFilterCheckbox = filterCheck => {
  filterCheckbox.checked = filterCheck;
  chrome.storage.local.set({ autoFilter: filterCheck });

  // side effect
  filterRadios.forEach(item => (item.disabled = !filterCheck));
};

const getFilterType = () => {
  return document.querySelector('input[name="filter"]:checked').value;
};
const setFilterType = filterType => {
  for (let i = 0; i < filterRadios.length; i++) {
    if (filterRadios[i].value === filterType) {
      filterRadios[i].checked = true;
      chrome.storage.local.set({ filterType: filterType });
      break;
    }
  }
};

// event binding
tabResizeInput.addEventListener('input', evt =>
  setTabSizeBar(evt.target.value)
);
foldCheckbox.addEventListener('input', evt =>
  setFoldCheckbox(evt.target.checked)
);
filterCheckbox.addEventListener('input', evt =>
  setFilterCheckbox(evt.target.checked)
);
for (let i = 0; i < filterRadios.length; i++) {
  filterRadios[i].addEventListener('change', evt => {
    setFilterType(evt.target.value);
  });
}

// for initialize use
document.addEventListener(
  'DOMContentLoaded',
  () => {
    chrome.storage.local.get(
      {
        tabSize: 4,
        autoFold: true,
        autoFilter: true,
        filterType: 'author_username'
      },
      data => {
        setTabSizeBar(data.tabSize);
        setFoldCheckbox(data.autoFold);
        setFilterCheckbox(data.autoFilter);
        setFilterType(data.filterType);
      }
    );
  },
  false
);

// process click event
// foldClickButton.addEventListener(
//   'click',
//   e => {
//     // TODO: should judge current url then decide whether to send action
//     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//       chrome.tabs.sendMessage(tabs[0].id, { cmd: 'triggerFold' }, resp => {
//         console.log('Response: ', resp);
//       });
//     });
//     e.preventDefault();
//   },
//   false
// );

// filterClickButton.addEventListener(
//   'click',
//   e => {
//     console.log('current URL is:', window.location.href);
//     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//       chrome.tabs.sendMessage(tabs[0].id, { cmd: 'triggerFilter' }, resp => {
//         console.log('Response: ', resp);
//       });
//     });
//     e.preventDefault();
//   },
//   false
// );
