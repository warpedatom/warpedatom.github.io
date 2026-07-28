// Search page — Pagefind API with JSON fallback for local dev
(function () {
  var body = document.body || document.documentElement;
  var indexUrl = body.getAttribute('data-search-index-url') || '/search.json';
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var status = document.getElementById('search-status');

  if (!input || !results) return;

  function setStatus(text) { if (status) status.textContent = text; }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function debounce(fn, wait) {
    var timer;
    return function () { clearTimeout(timer); timer = setTimeout(fn, wait); };
  }

  // --- Pagefind path ---------------------------------------------------
  import('/pagefind/pagefind.js').then(function (pagefind) {
    setStatus('Type at least 2 characters.');

    input.addEventListener('input', debounce(function () {
      var q = (input.value || '').trim();
      if (q.length < 2) {
        setStatus('Type at least 2 characters.');
        clear(results);
        return;
      }

      pagefind.search(q).then(function (search) {
        clear(results);
        if (!search || search.results.length === 0) {
          setStatus('No results found.');
          return;
        }
        setStatus(search.results.length + ' result' + (search.results.length === 1 ? '' : 's') + '.');

        search.results.slice(0, 15).forEach(function (result) {
          result.data().then(function (data) {
            var li = document.createElement('li');

            var stamp = document.createElement('span');
            stamp.className = 'stamp';
            stamp.textContent = data.meta.date || '';

            var link = document.createElement('a');
            link.href = data.url;
            link.textContent = data.meta.title || data.url;

            var excerpt = document.createElement('p');
            excerpt.className = 'search-excerpt';
            excerpt.innerHTML = data.excerpt; // pagefind-generated HTML, safe

            if (stamp.textContent) {
              li.appendChild(stamp);
              li.appendChild(document.createTextNode(' '));
            }
            li.appendChild(link);
            li.appendChild(excerpt);
            results.appendChild(li);
          });
        });
      });
    }, 200));
  }).catch(function () {
    // --- JSON fallback (local dev / pagefind index not yet built) --------
    legacySearch();
  });

  // --- Legacy JSON search ----------------------------------------------
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
    var to = Math.min(source.length, idx + q.length + 115);
    var snippet = source.slice(from, to);
    if (from > 0) snippet = '\u2026' + snippet;
    if (to < source.length) snippet += '\u2026';
    return snippet;
  }

  function legacySearch() {
    var posts = [];

    function render(query) {
      clear(results);
      if (query.length < 2) { setStatus('Type at least 2 characters.'); return; }
      var matches = posts.filter(function (p) {
        var title   = String(p.title   || '').toLowerCase();
        var content = String(p.content || '').toLowerCase();
        var tags    = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
        return title.indexOf(query) !== -1 || content.indexOf(query) !== -1 || tags.indexOf(query) !== -1;
      });
      if (matches.length === 0) { setStatus('No results found.'); return; }
      setStatus(matches.length + ' result' + (matches.length === 1 ? '' : 's') + '.');
      matches.forEach(function (p) {
        var li = document.createElement('li');
        var stamp = document.createElement('span');
        stamp.className = 'stamp';
        stamp.textContent = p.date || '';
        var link = document.createElement('a');
        link.href = p.url || '#';
        appendHighlighted(link, p.title || 'Untitled', query);
        var excerpt = document.createElement('p');
        excerpt.className = 'search-excerpt';
        appendHighlighted(excerpt, previewText(p.content, query), query);
        li.appendChild(stamp);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(link);
        li.appendChild(excerpt);
        results.appendChild(li);
      });
    }

    setStatus('Loading search index\u2026');
    fetch(indexUrl, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (d) {
        posts = Array.isArray(d) ? d : [];
        setStatus('Type at least 2 characters.');
        input.addEventListener('input', debounce(function () {
          render(String(input.value || '').toLowerCase().trim());
        }, 150));
      })
      .catch(function () { setStatus('Search is temporarily unavailable.'); });
  }
})();

