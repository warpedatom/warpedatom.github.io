// Search page — Pagefind API with JSON fallback for local dev
(function () {
  var MSG_MIN  = 'Type at least 2 characters.';
  var MSG_NONE = 'No results found.';

  var body     = document.body || document.documentElement;
  var indexUrl = body.getAttribute('data-search-index-url') || '/search.json';
  var input    = document.getElementById('search-input');
  var results  = document.getElementById('search-results');
  var status   = document.getElementById('search-status');

  if (!input || !results) return;

  // --- Shared helpers --------------------------------------------------
  function setStatus(text) { if (status) status.textContent = text; }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function debounce(fn, wait) {
    var timer;
    return function () { clearTimeout(timer); timer = setTimeout(fn, wait); };
  }

  function requireMinQuery(q) {
    if (q.length < 2) { setStatus(MSG_MIN); clear(results); return false; }
    return true;
  }

  function updateResultCount(count) {
    if (!count) { setStatus(MSG_NONE); return false; }
    setStatus(count + ' result' + (count === 1 ? '' : 's') + '.');
    return true;
  }

  function appendHighlighted(el, text, query) {
    var source = String(text || '');
    var q = String(query || '').toLowerCase();
    if (!q) { el.textContent = source; return; }
    var lower = source.toLowerCase();
    var start = 0, idx = lower.indexOf(q);
    if (idx === -1) { el.textContent = source; return; }
    while (idx !== -1) {
      if (idx > start) el.appendChild(document.createTextNode(source.slice(start, idx)));
      var mark = document.createElement('mark');
      mark.className = 'search-mark';
      mark.textContent = source.slice(idx, idx + q.length);
      el.appendChild(mark);
      start = idx + q.length;
      idx = lower.indexOf(q, start);
    }
    if (start < source.length) el.appendChild(document.createTextNode(source.slice(start)));
  }

  function previewText(text, query) {
    var source = String(text || '');
    if (!query) return source.slice(0, 160);
    var lower = source.toLowerCase();
    var q = query.toLowerCase();
    var idx = lower.indexOf(q);
    if (idx === -1) return source.slice(0, 160);
    var from = Math.max(0, idx - 45);
    var to   = Math.min(source.length, idx + q.length + 115);
    var snippet = source.slice(from, to);
    if (from > 0) snippet = '\u2026' + snippet;
    if (to < source.length) snippet += '\u2026';
    return snippet;
  }

  // Safely parse a Pagefind excerpt (text + <mark> highlights only)
  function parseExcerpt(html) {
    var frag = document.createDocumentFragment();
    // Split on <mark>...</mark>; works for Pagefind's simple highlight markup
    var parts = String(html || '').split(/(<mark[^>]*>[\s\S]*?<\/mark>)/i);
    parts.forEach(function (part) {
      var m = part.match(/^<mark[^>]*>([\s\S]*?)<\/mark>$/i);
      if (m) {
        var mark = document.createElement('mark');
        mark.textContent = m[1];
        frag.appendChild(mark);
      } else {
        // Unescape HTML entities (e.g. &amp; &lt;) present in plain-text segments
        // DOMParser is safe: it never executes scripts when parsing 'text/html'
        var doc = (new DOMParser()).parseFromString(part, 'text/html');
        frag.appendChild(document.createTextNode(doc.body ? doc.body.textContent : part));
      }
    });
    return frag;
  }

  function createResultItem(stampText, href, titleNode, excerptContent) {
    var li = document.createElement('li');
    if (stampText) {
      var stamp = document.createElement('span');
      stamp.className = 'stamp';
      stamp.textContent = stampText;
      li.appendChild(stamp);
      li.appendChild(document.createTextNode(' '));
    }
    var link = document.createElement('a');
    link.href = href;
    link.appendChild(titleNode);
    li.appendChild(link);
    if (excerptContent) {
      var p = document.createElement('p');
      p.className = 'search-excerpt';
      p.appendChild(excerptContent);
      li.appendChild(p);
    }
    return li;
  }

  // --- Pagefind path ---------------------------------------------------
  function setupPagefindSearch(pagefind) {
    setStatus(MSG_MIN);
    input.addEventListener('input', debounce(function () {
      var q = (input.value || '').trim();
      if (!requireMinQuery(q)) return;

      pagefind.search(q).then(function (search) {
        clear(results);
        var count = search && search.results ? search.results.length : 0;
        if (!updateResultCount(count)) return;

        search.results.slice(0, 15).forEach(function (result) {
          result.data().then(function (data) {
            var titleNode = document.createTextNode(data.meta.title || data.url);
            var li = createResultItem(
              data.meta.date || '',
              data.url,
              titleNode,
              parseExcerpt(data.excerpt)
            );
            results.appendChild(li);
          });
        });
      });
    }, 200));
  }

  // Gate on ESM feature support to avoid a parse-time error in legacy environments.
  // 'noModule' in HTMLScriptElement.prototype is a reliable proxy for dynamic import.
  var supportsESM = 'noModule' in HTMLScriptElement.prototype;
  if (supportsESM) {
    import('/pagefind/pagefind.js')
      .then(setupPagefindSearch)
      .catch(legacySearch);
  } else {
    legacySearch();
  }

  // --- Legacy JSON search ----------------------------------------------
  function legacySearch() {
    var posts = [];

    function render(query) {
      clear(results);
      if (!requireMinQuery(query)) return;
      var matches = posts.filter(function (p) {
        var title   = String(p.title   || '').toLowerCase();
        var content = String(p.content || '').toLowerCase();
        var tags    = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
        return title.indexOf(query) !== -1 || content.indexOf(query) !== -1 || tags.indexOf(query) !== -1;
      });
      if (!updateResultCount(matches.length)) return;
      matches.forEach(function (p) {
        var titleNode = document.createElement('span');
        appendHighlighted(titleNode, p.title || 'Untitled', query);
        var excerptNode = document.createElement('span');
        appendHighlighted(excerptNode, previewText(p.content, query), query);
        var li = createResultItem(p.date || '', p.url || '#', titleNode, excerptNode);
        results.appendChild(li);
      });
    }

    setStatus('Loading search index\u2026');
    fetch(indexUrl, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (d) {
        posts = Array.isArray(d) ? d : [];
        setStatus(MSG_MIN);
        input.addEventListener('input', debounce(function () {
          render(String(input.value || '').toLowerCase().trim());
        }, 150));
      })
      .catch(function () { setStatus('Search is temporarily unavailable.'); });
  }
})();

