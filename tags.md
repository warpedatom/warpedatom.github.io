---
layout: page
title: Topics
permalink: /tags/
description: "Write-ups grouped by topic."
---

# Browse by topic

{% assign sorted_tags = site.tags | sort %}
{% for tag in sorted_tags %}
<h2 id="{{ tag[0] | slugify }}">{{ tag[0] }}</h2>
<ul class="post-list">
{% for post in tag[1] %}
  <li>
    <span class="stamp">{{ post.date | date: "%Y-%m-%d" }}</span>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </li>
{% endfor %}
</ul>
{% endfor %}
