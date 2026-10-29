import memes from '../data/memes.json';
import imageMemes from '../data/image-memes.json';
import platforms from '../data/platforms.json';

export const SITE = 'https://cnmemes.com';

/** Tags that actually have a page — text and image memes both create tag pages. */
export const allTags = [
  ...new Set([...memes, ...imageMemes].flatMap(m => m.tags)),
].sort();

/** Era pages (2004/2009/2014) plus one page per year from 2015 onward. */
export const yearPages = [
  ...new Set([
    2004,
    2009,
    2014,
    ...[...new Set(memes.map(m => m.year))].filter(y => y >= 2015),
  ]),
].sort((a, b) => a - b);

export interface SitemapEntry {
  path: string;
  priority: string;
  changefreq: string;
}

/** Every URL the site actually renders (excluding 404). Keep in sync with getStaticPaths. */
export function sitemapEntries(): SitemapEntry[] {
  return [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/top-memes', priority: '0.9', changefreq: 'monthly' },
    { path: '/memes', priority: '0.8', changefreq: 'weekly' },
    { path: '/image-memes', priority: '0.8', changefreq: 'weekly' },
    { path: '/platforms', priority: '0.6', changefreq: 'monthly' },
    { path: '/about', priority: '0.5', changefreq: 'monthly' },
    ...memes.map(m => ({ path: `/meme/${m.slug}`, priority: '0.7', changefreq: 'monthly' })),
    ...imageMemes.map(m => ({ path: `/image-meme/${m.slug}`, priority: '0.6', changefreq: 'monthly' })),
    ...platforms.map(p => ({ path: `/platform/${p.slug}`, priority: '0.7', changefreq: 'monthly' })),
    ...allTags.map(tag => ({ path: `/tag/${tag}`, priority: '0.6', changefreq: 'monthly' })),
    ...yearPages.map(year => ({ path: `/year/${year}`, priority: '0.6', changefreq: 'monthly' })),
  ];
}
