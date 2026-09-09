---
title: "Why I rebuilt this site in Astro"
description: "A hand-written index.html grew to 29KB and five stylesheets. Here is what replaced it and why."
pubDate: 2026-02-03
tags: ["web", "astro"]
---

The previous version of this site was one `index.html` file, 29 kilobytes of it, plus five
stylesheets and two scripts that only that one page loaded. It worked. GitHub Pages served
it, the custom domain resolved, and the App Store privacy links pointed at static pages that
had not changed in months.

The problem was not performance. It was that adding a page meant copying a page.

## The constraint that shaped everything

Every app I ship has a privacy policy and a support page whose URL is typed into App Store
Connect. Those URLs are effectively permanent:

```
/Memorandum/privacy.html
/kagiru/privacy_policy.html
/light_and_year/support.html
```

Break one and Apple's listing points at a 404, which is both embarrassing and a review risk.
So the rule for the rebuild was simple: those files do not get touched, reformatted, or
regenerated. They move into Astro's `public/` directory, which copies its contents to the
build output byte-for-byte, and the URLs stay identical.

## Why Astro specifically

I wanted Markdown files in a folder and HTML out the other end, with no client-side
framework shipped to the reader. Astro's content collections give me a typed schema for
frontmatter:

```ts
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './blog_posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});
```

A typo in a date now fails the build instead of rendering `Invalid Date` in production.

## The part that is just for fun

There is a query console on this site. Press `/` and try:

```sql
SELECT * FROM posts WHERE tag = 'astro';
```

It is not a real SQL engine — it is about eighty lines of regex over a JSON index — but it
does search the blog, and it made the rebuild considerably more enjoyable than it needed to be.
