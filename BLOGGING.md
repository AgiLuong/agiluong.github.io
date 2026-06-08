# Writing a blog post

Posts live in `_posts/` as Markdown files. To publish a new post, add **one file** —
no HTML boilerplate, no editing the blog index (it updates itself).

## 1. Create a file

Name it `_posts/YYYY-MM-DD-your-slug.md`. The date and slug come from the filename:

```
_posts/2026-06-07-hello-world.md   ->   https://agiluong.github.io/blog/hello-world/
```

## 2. Add a title and write

```markdown
---
title: Hello World
---

This is my first post. Write in plain **Markdown**.

- bullet lists
- [links](https://example.com)
- `code`, > quotes, ## headings, etc.
```

That's it. The title, date, nav bar, and styling are added automatically, and the
post shows up on `/blog/` (newest first).

## Drafts (optional)

Put work-in-progress posts in `_drafts/` (no date in the filename, e.g.
`_drafts/my-idea.md`). They are ignored on the live site. Preview them locally with:

```bash
bundle exec jekyll serve --drafts
```

## Preview locally (optional)

```bash
bundle install      # first time only
bundle exec jekyll serve
# open http://localhost:4000
```

## Updating links (resume, meeting, etc.)

All external links live in `_data/links.yml`. Change a URL there and it updates
everywhere on the site (nav bar, home page, contact page, /meet redirect).
