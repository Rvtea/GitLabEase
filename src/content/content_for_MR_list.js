/*
  This file is used to handle URL like: `https://git.yourdomain/yourrepo/merge_requests [?scope=all&utf8=✓&state=merged]`
  * this url aims to MR list page
  * content in [...] might not be existed.
*/

const AuthorFilter = 'author_username';
const AssgineeFilter = 'assignee_username';

const listAction = page_url => {
  let autoFilter = false;
  let actualFilter = AuthorFilter;
  chrome.storage.local.get(
    {
      autoFilter: false,
      filterType: AuthorFilter
    },
    data => ([autoFilter, actualFilter] = [data.autoFilter, data.filterType])
  );

  document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();

    if (user != '' && autoFilter) {
      // we use location.href change event to redirect to related filter instead of simulate click & enter in filter input
      // for author=currrentUser, append `&author_username=${user}`
      // for assignee=currentUser, append `&assignee_username=${user}`
      // need judge if page url already contains strings like above, if yes, do not append!
      const contained =
        page_url.match(AuthorFilter) !== null ||
        page_url.match(AssgineeFilter) !== null;

      if (!contained) {
        navigateToFilterPage(page_url, actualFilter, user);
      }
    }
  });
};

// TODO: in v1.4 I choose location change event, but in future release, I shall use the tech I developed in [MITM](https://github.com/Rvtea/MITM) to redirect URL to reduce one extra page rendering.
const navigateToFilterPage = (origin_url, filter, user_name) => {
  const questionMarkContained = origin_url.match(/merge_requests\?/);
  if (questionMarkContained === null) {
    window.location.href = origin_url + `?&${filter}=${user_name}`;
  } else {
    window.location.href = origin_url + `&${filter}=${user_name}`;
  }
};
