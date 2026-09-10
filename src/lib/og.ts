import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const FONT_DIR = path.join(process.cwd(), 'src/assets/fonts');

let fontCache: { name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[] | null = null;

async function fonts() {
  if (fontCache) return fontCache;
  const [regular, bold] = await Promise.all([
    fs.readFile(path.join(FONT_DIR, 'JetBrainsMono-Regular.ttf')),
    fs.readFile(path.join(FONT_DIR, 'JetBrainsMono-Bold.ttf')),
  ]);
  fontCache = [
    { name: 'JetBrains Mono', data: regular, weight: 400, style: 'normal' },
    { name: 'JetBrains Mono', data: bold, weight: 700, style: 'normal' },
  ];
  return fontCache;
}

const BG = '#0a0a0a';
const FG = '#ededed';
const MUTED = '#8a8a8a';
const LINE = '#262626';

type CardInput = {
  /** the dimmed `-- …` comment line at the top */
  eyebrow: string;
  title: string;
  /** small line under the rule, e.g. "2026-09-10  ·  ~6 min" */
  meta?: string;
};

/** Title sizing: long titles wrap, so step down to keep them inside the card. */
function titleSize(title: string) {
  if (title.length > 78) return 52;
  if (title.length > 52) return 62;
  return 74;
}

export async function renderCard({ eyebrow, title, meta }: CardInput): Promise<Buffer> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '64px 72px',
          fontFamily: 'JetBrains Mono',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 26, color: MUTED, marginBottom: 28 },
                    children: eyebrow,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: titleSize(title),
                      fontWeight: 700,
                      color: FG,
                      lineHeight: 1.18,
                      letterSpacing: '-0.03em',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `2px solid ${LINE}`,
                paddingTop: 26,
                fontSize: 26,
                color: MUTED,
              },
              children: [
                { type: 'div', props: { children: 'horaciogarza.app' } },
                { type: 'div', props: { children: meta ?? '' } },
              ],
            },
          },
        ],
      },
    },
    { width: OG_WIDTH, height: OG_HEIGHT, fonts: await fonts() }
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } })
    .render()
    .asPng();
  return Buffer.from(png);
}
