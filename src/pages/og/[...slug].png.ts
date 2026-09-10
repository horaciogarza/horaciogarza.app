import type { APIContext } from 'astro';
import { getPosts, countWords } from '../../lib/posts';
import { renderCard } from '../../lib/og';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post, words: countWords(post.body) },
  }));
}

export async function GET({ props }: APIContext) {
  const { post, words } = props as {
    post: Awaited<ReturnType<typeof getPosts>>[number];
    words: number;
  };
  const minutes = Math.max(1, Math.round(words / 220));
  const date = post.data.pubDate.toISOString().slice(0, 10);

  const png = await renderCard({
    eyebrow: `-- SELECT * FROM posts WHERE id = '${post.id}';`,
    title: post.data.title,
    meta: `${date}  ·  ~${minutes} min`,
  });

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
