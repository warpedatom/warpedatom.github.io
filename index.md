---
layout: default
description: "Offensive security research, red team notes, and malware analysis by Velkris."
---

<p class="lead">I'm <strong>Velkris</strong> - a cybersecurity practitioner and
red team operator. Field notes on offensive tooling, malware internals, and
adversary tradecraft.</p>

## Writing

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year_group in posts_by_year %}
<h3 class="year-heading">{{ year_group.name }}</h3>
<ul class="post-list">
{% for post in year_group.items %}
  <li>
    <span class="stamp">{{ post.date | date: "%Y-%m-%d" }}</span>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </li>
{% endfor %}
</ul>
{% else %}
<ul class="post-list"><li>No posts yet.</li></ul>
{% endfor %}
