// Projects page GitHub stats widgets
(function () {
  var TTL = 36e5; // 1 hour

  function cached(url, key, cb) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) {
        var entry = JSON.parse(raw);
        if (Date.now() - entry.ts < TTL) {
          cb(entry.d);
          return;
        }
      }
    } catch (e) {}

    fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d) {
          try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), d: d })); } catch (e) {}
        }
        cb(d);
      })
      .catch(function () { cb(null); });
  }

  function badge(text, extra) {
    var s = document.createElement('span');
    s.className = 'gh-badge' + (extra ? ' ' + extra : '');
    s.textContent = text;
    return s;
  }

  document.querySelectorAll('.gh-stats[data-repo]').forEach(function (el) {
    var repo = el.dataset.repo;

    cached('https://api.github.com/repos/' + repo, 'gh_repo_' + repo, function (d) {
      if (!d) return;
      el.appendChild(badge('\u2605 ' + d.stargazers_count.toLocaleString()));
      if (d.forks_count) el.appendChild(badge('\u2387 ' + d.forks_count.toLocaleString()));
      if (d.language) el.appendChild(badge(d.language));
    });

    cached('https://api.github.com/repos/' + repo + '/releases/latest', 'gh_rel_' + repo, function (d) {
      if (!d || !d.tag_name) return;
      el.appendChild(badge(d.tag_name, 'gh-badge-rel'));
    });
  });
})();
