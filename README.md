# velkris.red

Source for **[velkris.red](https://velkris.red)** (also served at
[warpedatom.github.io](https://warpedatom.github.io)) - *offensive security
research, red team notes, and malware analysis* by Velkris.

Built with [Jekyll](https://jekyllrb.com/) 4 and a custom dark theme, deployed
to GitHub Pages via GitHub Actions. Original write-ups on publicly documented
techniques, plus my open-source tooling ([OffsetInspect](https://github.com/warpedatom/OffsetInspect),
[OffsetScan](https://github.com/warpedatom/OffsetScan)).

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
layout: post
title: "My write-up"
date: 2026-07-27
---

Body in Markdown...
```

The date-based permalink and `post` layout are applied automatically.

## How it deploys

Pushing to `main` runs `.github/workflows/pages.yml`, which builds with Jekyll
and publishes to GitHub Pages. Source: **Settings → Pages → GitHub Actions**.

## Structure

```
_config.yml              Site configuration
Gemfile                  Ruby dependencies
index.md                 Home (auto-lists posts)
projects.md · about.md   Pages
_posts/                  Write-ups
_layouts/                default / page / post
assets/                  CSS + skull watermark
.github/                 Workflow, issue templates, funding
```
