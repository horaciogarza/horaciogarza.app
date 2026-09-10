import { getCollection, type CollectionEntry } from 'astro:content';

// -- WHERE draft = FALSE (in prod) ORDER BY pub_date DESC
export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
  const all = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function countWords(body: string | undefined): number {
  if (!body) return 0;
  return body.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Posts most worth reading next: the ones sharing the most tags, newest first
 * on a tie. Tops up with recent posts so the grid still fills when a post has
 * no tag siblings.
 */
export function relatedPosts(
  post: CollectionEntry<'posts'>,
  all: CollectionEntry<'posts'>[],
  limit = 4
): CollectionEntry<'posts'>[] {
  const tags = new Set(post.data.tags);
  const others = all.filter((p) => p.id !== post.id);

  const scored = others
    .map((p) => ({ p, shared: p.data.tags.filter((t) => tags.has(t)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) =>
      b.shared - a.shared || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf()
    )
    .map((x) => x.p);

  const picked = scored.slice(0, limit);
  if (picked.length < limit) {
    const seen = new Set(picked.map((p) => p.id));
    for (const p of others) {
      if (picked.length >= limit) break;
      if (!seen.has(p.id)) picked.push(p);
    }
  }
  return picked;
}
