# warpedatom.github.io — Velkris Blog

Personal site: *Cybersecurity | Red Team | Research*. Built with
[Jekyll](https://jekyllrb.com/) 4 and the `jekyll-theme-hacker` theme,
deployed to GitHub Pages via GitHub Actions.

## Local development

```bash
bundle install
bundle exec jekyll serve --livereload
# → http://localhost:4000
```

## Writing a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-title.md`:

```markdown
---
title: "My first writeup"
date: 2026-07-27
---

Post body in Markdown...
```

The `layout: default` is applied automatically via `_config.yml` defaults.

## How it deploys

Pushing to `main` runs `.github/workflows/pages.yml`, which builds with
Jekyll and publishes to GitHub Pages.

**Settings → Pages → Build and deployment → Source** must be **GitHub Actions**.
