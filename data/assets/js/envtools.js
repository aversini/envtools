/* globals $, hljs, lunr */
/* eslint no-magic-numbers: 0 */

$(function () {
  var
    faqTOC,
    globalTimeout = null,
    index,
    data,
    dataJson,
    search;

  function parseQueryString(query) {
    var
      parser = /([^=?&]+)=?([^&]*)/g,
      result = {},
      part;

    for (; part = parser.exec(query); result[decodeURIComponent(part[1])] = decodeURIComponent(part[2]));
    return result;
  }

  function absoluteOffset(elem) {
    return elem.offsetParent && elem.offsetTop + absoluteOffset(elem.offsetParent);
  }

  function applySearch(self) {
    var
      res,
      query = $(self).val();

    // reset highlight
    $('.faq-content').unhighlight();

    res = index.search(query);
    if (res && res.length) {
      faqTOC.hide(true);
      $.each(query.split(' '), function (i, q) {
        $('.faq-content').highlight(q);
      });

      $('.faq-entry').each(function (entry, data) {
        $(data).addClass('hidden');
      });

      $.each(res, function (i, item) {
        $('#' + item.ref).removeClass('hidden');
      });
    } else {
      faqTOC.show();
      $('.faq-entry').each(function (entry, data) {
        $(data).removeClass('hidden');
      });
    }
  }

  data = $('#envtools-data').html();
  if (data) {
    dataJson = JSON.parse(data);
  }

  // update version if found
  if (dataJson && dataJson.version) {
    $('.envtools-footer .envtools-version').html('v' + dataJson.version + ' - ');
  }

  hljs.initHighlightingOnLoad();
  search = Object.keys(parseQueryString(document.location.search));

  // hide content for mac if not a mac browser
  if (navigator.userAgent.match(/mac os x/i)) {
    $('.mac-only').removeClass('mac-only');
  }

  // go to the tab listed in the query string if any
  if (search && search.length) {
    // select tab by name
    $('.envtools-tabs a[href="#' + search[0] + '"]').tab('show');
  }

  // activate tab navigation
  $('.envtools-tabs a').click(function (e) {
    var
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

  // populate the FAQs (TOC and entries)
  if (dataJson && dataJson.faqData) {
    faqTOC = $('#faq .envtools-toc');
    $.each(dataJson.faqData, function (i, faq) {
      var
        tagEl = $('<div class="faq-tags">'),
        el = $('<div id="' + faq.id + '" class="faq-entry">')
        .append($('<p class="h3 faq-title">').text(faq.title))
        .append($('<div class="faq-content">').html(faq.content));
      if (faq.tags && faq.tags.length) {
        tagEl.append(faq.tags.sort().map(function (tag) {
          return $('<span class=" faq-tag-badge badge">').text(tag);
        }));
      }
      el.append(tagEl);
      if (faq.group) {
        $('#' + faq.group).append(el);
      } else {
        $('#faq-misc').append(el);
      }
      // adding entry to TOC
      faqTOC.append('<a class="toc-row" href="#" data-id="' +
        faq.id + '">' +
        '<span class="toc-head">' + faq.title + '</span>' +
        '</a>');
    });
  }

  // handle toc navigation (directly to the id would fail because of the
  // extra margin for the tabs... hence this little scrolling black magic...)
  $('.envtools-toc a').click(function (e) {
    var
      content,
      marginTop,
      toc = $(this).attr('data-id');

    e.preventDefault();
    content = $('.content');
    marginTop = Number(content.css('marginTop').replace('px', ''));
    window.scroll(0, absoluteOffset(document.getElementById(toc)) - marginTop + 10);
    $('#' + toc).addClass('toc-highlight');
  });

  // Load the lunrjs search index (for FAQs search)
  index = lunr.Index.load(dataJson.faqIndex);

  // Handle search on the FAQ page
  $('input#search-faq').on('keyup', function () {
    var self = this;
    if (globalTimeout !== null) {
      clearTimeout(globalTimeout);
    }
    globalTimeout = setTimeout(function () {
      globalTimeout = null;
      applySearch(self);
    }, 250);
  });

  // showtime
  $('.envtools-help .content').removeClass('hidden');
});
