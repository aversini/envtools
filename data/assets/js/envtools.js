/*eslint-disable*/

$(function () {
  hljs.initHighlightingOnLoad();


  $('.envtools-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  if (navigator.userAgent.match(/mac os x/i)) {
    $('.mac-only').removeClass('mac-only');
  }
});
