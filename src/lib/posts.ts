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
