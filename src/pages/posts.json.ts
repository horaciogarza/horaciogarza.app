import type { APIContext } from 'astro';
import { getPosts } from '../lib/posts';

// -- the "table" the on-page SQL console queries
export async function GET(_context: APIContext) {
  const posts = await getPosts();
  const rows = posts.map((p) => ({
    title: p.data.title,
    url: `/blog/${p.id}`,
    date: p.data.pubDate.toISOString().slice(0, 10),
    tags: p.data.tags,
    description: p.data.description,
  }));
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}
