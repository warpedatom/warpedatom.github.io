---
layout: default
description: "Offensive security research, red team notes, and malware analysis by Velkris."
---

<p class="lead">I'm <strong>Velkris</strong> — a cybersecurity practitioner and
red team operator. Field notes on offensive tooling, malware internals, and
adversary tradecraft.</p>

## Writing

<ul class="post-list">
{% for post in site.posts %}
  <li>
    <span class="stamp">{{ post.date | date: "%Y-%m-%d" }}</span>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </li>
{% else %}
  <li>No posts yet.</li>
{% endfor %}
</ul>
