export type App = {
  name: string;
  tagline: string;
  description: string;
  status: 'live' | 'soon';
  icon: string;          // path under /assets (served from public/)
  appStore?: string;
  links: { label: string; href: string }[];
};

// -- SELECT * FROM apps ORDER BY status, name;
export const apps: App[] = [
  {
    name: 'Memorandum',
    tagline: 'Memorize and Win',
    description:
      'A memory game with seasonal themes, built family-friendly and privacy-first.',
    status: 'live',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/3f/d1/85/3fd185fd-1c76-ae3d-6e87-c9a5e6a8c3a7/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/256x256bb.jpg',
    appStore: 'https://apps.apple.com/mx/app/memorandum-memorize-and-win/id6756941530',
    links: [
      { label: 'Privacy', href: '/Memorandum/privacy.html' },
      { label: 'Support', href: '/Memorandum/support.html' },
    ],
  },
  {
    name: 'Light and Year',
    tagline: 'Tap, Hold, Survive',
    description:
      'Addictively simple, brutally challenging. Collect power-ups, chase high scores, one wrong move and it is over.',
    status: 'live',
    icon: '/assets/light_and_year/icon-256.webp',
    appStore: 'https://apps.apple.com/mx/app/light-and-year/id6756282999',
    links: [
      { label: 'Privacy', href: '/light_and_year/privacy.html' },
      { label: 'Support', href: '/light_and_year/support.html' },
    ],
  },
  {
    name: 'Explorare',
    tagline: 'Discover Culinary Delights',
    description:
      'Find your next favorite restaurant by swiping. Personalized to your location and taste.',
    status: 'live',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a2/ee/6c/a2ee6c23-fd56-6382-ccbf-f2cb42f37f7e/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/256x256bb.jpg',
    appStore: 'https://apps.apple.com/us/app/explorare/id6756599099',
    links: [
      { label: 'Privacy', href: '/explorare/privacy.html' },
      { label: 'Support', href: '/explorare/support.html' },
    ],
  },
  {
    name: 'Kura',
    tagline: 'Collect Everything',
    description:
      'A collection tracker for sneakers, vinyl, comics and trading cards — photos, custom fields, stats, all private.',
    status: 'live',
    icon: '/assets/kura/icon-256.webp',
    appStore: 'https://apps.apple.com/mx/app/kura-collect-everything/id6760570602',
    links: [
      { label: 'Privacy', href: '/Kura/privacy.html' },
      { label: 'Support', href: '/Kura/support.html' },
    ],
  },
  {
    name: 'Atlas',
    tagline: 'Learn Everything',
    description:
      'AI-powered micro-learning that adapts to you: personalized lessons, five difficulty levels, streaks and achievements.',
    status: 'soon',
    icon: '/assets/atlas/icon.svg',
    links: [
      { label: 'Privacy', href: '/Atlas/privacy.html' },
      { label: 'Terms', href: '/Atlas/terms.html' },
    ],
  },
  {
    name: 'Kagiru',
    tagline: 'Your Gym Companion',
    description:
      'Strength training logged into XP, levels, streaks and badges. Private by design, optional Apple Health sync.',
    status: 'soon',
    icon: '/assets/kagiru/icon-256.webp',
    links: [
      { label: 'Privacy', href: '/kagiru/privacy_policy.html' },
      { label: 'Terms', href: '/kagiru/terms_and_conditions.html' },
    ],
  },
  {
    name: 'Habitree',
    tagline: 'Grow Your Habits',
    description:
      'Build lasting habits and watch a tree grow with every streak. A calm way to stay consistent.',
    status: 'soon',
    icon: '/assets/habitree/icon-256.webp',
    links: [],
  },
];
