import { renderCard } from '../../lib/og';

// -- the card every non-post page falls back to
export async function GET() {
  const png = await renderCard({
    eyebrow: '-- USE horaciogarza;',
    title: 'Horacio Garza',
    meta: 'Data & AI',
  });
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
