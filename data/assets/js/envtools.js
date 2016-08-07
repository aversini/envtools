/*eslint-disable*/

$(function () {
  hljs.initHighlightingOnLoad();
  $('.envtools-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
});
