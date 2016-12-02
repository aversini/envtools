/* globals $, hljs, lunr */
/* eslint no-magic-numbers: 0 */

// initialize highlight (needs to be call outside of
// jQuery DOMContentLoaded since it does the detection
// itself.)
hljs.initHighlightingOnLoad();

$(function () {
  var
    version,
    allFaqContent,
    allFaqEntries,
    faqTOCcontent,
    faqTOCtoggleButton,
    commandsTOCcontent,
    globalTimeout = null,
    index,
    data,
    dataJson,
    search,

    TOC_TOGGLE_SHOW_LABEL = 'show',
    TOC_TOGGLE_HIDE_LABEL = 'hide';

  // -- P R I V A T E  M E T H O D S
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

  function expandTOC(tocNode, toggleBtn) {
    tocNode.show();
    toggleBtn.text(TOC_TOGGLE_HIDE_LABEL);
  }

  function collapseTOC(tocNode, toggleBtn) {
    tocNode.hide();
    toggleBtn.text(TOC_TOGGLE_SHOW_LABEL);
  }

  function applySearch(self) {
    var
      res,
      query = $(self).val();

    // reset highlight
    allFaqContent.unhighlight();

    res = index.search(query);
    if (res && res.length) {
      // collapsing the TOC which tends to get in the way
      // of the search results...
      collapseTOC(faqTOCcontent, faqTOCtoggleButton);
      $.each(query.split(' '), function (i, q) {
        allFaqContent.highlight(q);
      });

      allFaqEntries.each(function (entry, data) {
        $(data).addClass('hidden');
      });

      $.each(res, function (i, item) {
        $('#' + item.ref).removeClass('hidden');
      });
    } else {
      allFaqEntries.each(function (entry, data) {
        $(data).removeClass('hidden');
      });
    }
  }


  // -- D A T A  I N I T I A L I Z A T I O N
  // loading json data from html if any
  data = $('#envtools-data').html();
  if (data) {
    dataJson = JSON.parse(data);
    version = (dataJson) ? dataJson.version : null;
  }

  // save the tab location from the url location if any
  search = Object.keys(parseQueryString(document.location.search));

  // handles on FAQ table of content (toggle button and content)
  faqTOCcontent = $('#faq .envtools-faq-toc-content');
  faqTOCtoggleButton = $('.faq-toc-toggle');

  // handle on commands table of content entries
  commandsTOCcontent = $('#commands .envtools-commands-toc-content');

  // Load the lunrjs search index (for FAQs search)
  index = lunr.Index.load(dataJson.faqIndex);


  // -- U I  I N I T I A L I Z A T I O N
  // show version in footer if found
  if (version) {
    $('.envtools-footer .envtools-version').html('v' + version + ' - ');
  }

  // hide content for mac if not a mac browser
  if (navigator.userAgent.match(/mac os x/i)) {
    $('.mac-only').removeClass('mac-only');
  }

  // go to the tab listed in the query string if any
  if (search && search.length) {
    // select tab by name
    $('.envtools-tabs a[href="#' + search[0] + '"]').tab('show');
  }

  // faq toc is hidden to start with
  faqTOCcontent.hide();

  // commands toc is also hidden to start with
  commandsTOCcontent.hide();

  // populate the FAQs (TOC and entries) from json
  if (dataJson && dataJson.faqData) {
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
      faqTOCcontent.append('<a class="toc-row" href="#" data-id="' +
        faq.id + '">' +
        '<span class="toc-head">' + faq.title + '</span>' +
        '</a>');
    });
    // now that the DOM has all the faq, we can get a handle on them
    allFaqContent = $('.faq-content');
    allFaqEntries = $('.faq-entry');
  }


  // -- U I  E V E N T  B I N D I N G S
  // activate tab navigation
  $('.envtools-tabs a').click(function (e) {
    var
      tabBtn = $(this),
      tab = tabBtn.attr('data-id');

    e.preventDefault();

    $('.toc-highlight').removeClass('toc-highlight');
    window.scrollTo(0, 0);
    tabBtn.tab('show');
    if (history && history.pushState) {
      history.pushState({
        title: tab
      }, tab, '?' + tab);
    }
  });

  // handle expand/collapse of TOC (both FAQ and commands)
  $('.toc-toggle').click(function (e) {
    var
      toggleBtn = $(this),
      label = toggleBtn.text(),
      isFAQ = toggleBtn.hasClass('faq-toc-toggle');

    e.preventDefault();

    if (label === TOC_TOGGLE_SHOW_LABEL) {
      expandTOC((isFAQ) ? faqTOCcontent : commandsTOCcontent, toggleBtn);
    } else {
      collapseTOC((isFAQ) ? faqTOCcontent : commandsTOCcontent, toggleBtn);
    }
  });

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

  // Handle search on the FAQ page
  $('input#search-faq').on('keyup', function () {
    var
      self = this;
    if (globalTimeout !== null) {
      clearTimeout(globalTimeout);
    }
    globalTimeout = setTimeout(function () {
      globalTimeout = null;
      applySearch(self);
    }, 250);
  });


  // -- S H O W T I M E
  $('.loading').fadeOut();
  $('.container').fadeIn();
});
