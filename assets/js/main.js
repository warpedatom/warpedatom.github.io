// Site-wide behaviors (CSP-safe external script)
(function () {
  var body = document.body || document.documentElement;
  var swUrl = body.getAttribute('data-sw-url') || '/sw.js';
  var searchUrl = body.getAttribute('data-search-url') || '/search/';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(swUrl).catch(function () {});
  }

  document.querySelectorAll('.content img').forEach(function (img) {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  });

  (function backToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    var update = function () { btn.classList.toggle('visible', window.scrollY > 400); };
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  (function headingAnchors() {
    document.querySelectorAll('.content h2[id], .content h3[id]').forEach(function (h) {
      if (h.querySelector('.heading-anchor')) return;
      var a = document.createElement('a');
      a.className = 'heading-anchor';
      a.href = '#' + h.id;
      a.textContent = '#';
      a.setAttribute('aria-label', 'Link to this section');
      h.appendChild(a);
    });
  })();

  (function externalLinks() {
    document.querySelectorAll('.content a[href^="http"]').forEach(function (a) {
      if (a.hostname !== window.location.hostname) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  })();

  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var active = document.activeElement;
    if (!active) return;
    var tag = active.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || active.isContentEditable) return;
    var searchInput = document.getElementById('search-input');
    e.preventDefault();
    if (searchInput) searchInput.focus();
    else window.location.href = searchUrl;
  });
})();
