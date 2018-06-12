'use strict';

// common used func
const isPageLoading = () => {
  // check if loading status div is still display or not
  let loading_ele = document.getElementsByClassName('mr-loading-status');

  // if element not found, then page is still loading
  if (!loading_ele) {
    return true;
  }

  let loading = loading_ele[0].getElementsByTagName('div')[0].style.display;

  return loading != 'none';
};

const getUser = user_url => {
  // need handle the case that user not log in while he can still access the MR list page
  // * such as: https://gitlab.com/gitlab-org/gitlab-ee/merge_requests
  const ele = document.getElementsByClassName('header-user-dropdown-toggle');
  if (ele.length !== 0) {
    let user_url = ele[0].href;
    let idx = user_url.search(/\/\w+$/);
    if (idx !== -1) {
      // idx+1 due to '/xxx' need remove the '/'
      return user_url.slice(idx + 1);
    }
  }
  return '';
};
