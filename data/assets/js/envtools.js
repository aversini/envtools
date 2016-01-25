/*jshint jquery:true */



$(function () {
  // function _displayTab() {
  //   console.log('==> this: ', this);
  //   $(this).tab('show');
  // }

  // $('.envtools-tabs a').click(_displayTab);

  $('.envtools-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
});
