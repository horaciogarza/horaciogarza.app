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
heroImage: ./cover.jpg   # optional — put the file next to index.md
---

Body goes here.
```

Every post row on the homepage and `/blog` reserves a fixed image slot, so the
list does not reflow as art is added. A post without `heroImage` shows a `NULL`
placeholder in that slot; adding the frontmatter line fills it, and the same
image runs full-width at the top of the post. Astro resizes and re-encodes it at
build time, so drop in the original file rather than a hand-optimized one.

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

`public/CNAME` must match the custom domain configured in Settings -> Pages.
GitHub reads the domain from the CNAME file inside the published artifact, so a
mismatch silently reassigns the canonical hostname on the next deploy. The
canonical domain is the apex, `horaciogarza.app`: it has only A records, while
`www` also resolves over IPv6 and some mobile carriers cannot route to GitHub's
IPv6 addresses.
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
