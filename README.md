# horaciogarza.app

Personal blog + app landing pages. Built with [Astro](https://astro.build), deployed to
GitHub Pages from `main` via `.github/workflows/deploy.yml`.

```
npm install
npm run dev       # http://localhost:4321
npm run build     # -> dist/
npm run preview
```

## Writing a post

Create a folder under `blog_posts/` — the folder name becomes the URL
(`blog_posts/my-post/index.md` → `/blog/my-post`). Images can live beside the Markdown.

```markdown
---
title: "My post"
description: "One sentence for the listing, the RSS feed and the OG tags."
pubDate: 2026-04-01
tags: ["swift"]
draft: false          # optional — drafts are hidden in production builds
---

Body goes here.
```

Frontmatter is validated by a Zod schema in `src/content.config.ts`; a bad date or a
missing title fails the build rather than shipping.

## Frozen URLs — do not move these

Every app's privacy / support / terms page is referenced from its App Store listing.
They live in `public/` as untouched HTML so Astro copies them to `dist/` byte-for-byte:

```
/Atlas/index.html          /Atlas/privacy.html            /Atlas/terms.html
/Kura/privacy.html         /Kura/support.html
/Memorandum/privacy.html   /Memorandum/support.html
/explorare/privacy.html    /explorare/support.html
/kagiru/privacy_policy.html  /kagiru/terms_and_conditions.html
/light_and_year/privacy.html /light_and_year/support.html
/CNAME  /ads.txt  /app-ads.txt
```

The deploy workflow diffs each one against `public/` and fails the build if any drift.
These pages still use the legacy `public/styles/main.css`, which is why that stylesheet
stays around; the new site has its own design system in `src/styles/global.css`.

## Structure

| Path | What |
|---|---|
| `blog_posts/` | Markdown posts |
| `src/pages/` | Routes (`/`, `/blog`, `/blog/[slug]`, `/tags/[tag]`, `/apps`, `/about`, `/404`, `/rss.xml`, `/posts.json`) |
| `src/data/apps.ts` | The app list — edit here to add an app |
| `src/styles/global.css` | Design tokens + all styling |
| `src/scripts/motion.ts` | Parallax + scroll reveal |
| `src/scripts/console.ts` | The `/` SQL console |
| `public/` | Verbatim static files, including the frozen pages above |

Press `/` on any page.
