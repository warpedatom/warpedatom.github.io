---
layout: page
title: Search
permalink: /search/
description: "Search all posts on VELKRIS."
sitemap: false
---

<input type="search" id="search-input" class="search-input" placeholder="Search posts..." aria-label="Search posts" autocomplete="off">
<p style="margin-top:0.5rem;"><span class="read-time-inline">Press <kbd>/</kbd> anywhere on the site to jump here</span></p>
<ul class="post-list search-results" id="search-results"></ul>

<script>
(function(){
  var posts = [
    {% for post in site.posts %}
    {
      title: {{ post.title | jsonify }},
      url: {{ post.url | relative_url | jsonify }},
      date: "{{ post.date | date: '%Y-%m-%d' }}",
      tags: {{ post.tags | jsonify }},
      content: {{ post.content | strip_html | truncatewords: 200 | jsonify }}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];

  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');

  input.addEventListener('input', function(){
    var q = this.value.toLowerCase().trim();
    results.innerHTML = '';
    if (q.length < 2) return;

    var matches = posts.filter(function(p){
      return p.title.toLowerCase().indexOf(q) !== -1 ||
             p.content.toLowerCase().indexOf(q) !== -1 ||
             p.tags.join(' ').toLowerCase().indexOf(q) !== -1;
    });

    if (matches.length === 0) {
      results.innerHTML = '<li>No results found.</li>';
      return;
    }

    matches.forEach(function(p){
      var li = document.createElement('li');
      var stamp = document.createElement('span');
      stamp.className = 'stamp';
      stamp.textContent = p.date;
      var link = document.createElement('a');
      link.href = p.url;
      link.textContent = p.title;
      li.appendChild(stamp);
      li.appendChild(document.createTextNode(' '));
      li.appendChild(link);
      results.appendChild(li);
    });
  });

  // Focus search on / key
  document.addEventListener('keydown', function(e){
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  });
})();
</script>
