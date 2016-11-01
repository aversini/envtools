/*eslint-disable*/

function parseQueryString(query) {
  var
    parser = /([^=?&]+)=?([^&]*)/g,
    result = {},
    part;

  for (; part = parser.exec(query); result[decodeURIComponent(part[1])] = decodeURIComponent(part[2]));
  return result;
}

$(function () {
  var
    search;

  hljs.initHighlightingOnLoad();
  search = Object.keys(parseQueryString(document.location.search));

  // hide content for mac if not a mac browser
  if (navigator.userAgent.match(/mac os x/i)) {
    $('.mac-only').removeClass('mac-only');
  }

  // go to the tab listed in the query string if any
  if (search && search.length) {
    // select tab by name
    $('.envtools-tabs a[href="#' + search[0] + '"]').tab('show')
  }

  // activate tab navigation
  $('.envtools-tabs a').click(function (e) {
    var
      stateObj,
      tab = $(this).attr('data-id');

    e.preventDefault();
    window.scrollTo(0, 0);
    $(this).tab('show');
    if (history && history.pushState) {
      history.pushState({
        title: tab
      }, tab, '?' + tab);
    }
  });

  // showtime
  $('.envtools-help .content').removeClass('hidden');
});
