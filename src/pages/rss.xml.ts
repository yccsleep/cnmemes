import type { APIRoute } from 'astro';
import memes from '../data/memes.json';
import imageMemes from '../data/image-memes.json';
import { SITE } from '../utils/site';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const clean = (value: string) =>
  value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

interface FeedItem {
  title: string;
  url: string;
  description: string;
  category: string;
  year: number;
  popularity: number;
  slug: string;
}

const feedItems: FeedItem[] = [
  ...memes.map(m => ({
    title: `${m.chinese_name} (${m.pinyin}) — ${m.english_name}`,
    url: `${SITE}/meme/${m.slug}`,
    description: clean(m.english_explanation),
    category: m.tags[0] ?? 'meme',
    year: m.year,
    popularity: m.popularity,
    slug: m.slug,
  })),
  ...imageMemes.map(m => ({
    title: `${m.chinese_name} (${m.pinyin}) — ${m.english_name}`,
    url: `${SITE}/image-meme/${m.slug}`,
    description: clean(m.english_explanation),
    category: m.tags[0] ?? 'image-meme',
    year: m.year,
    popularity: m.popularity,
    slug: m.slug,
  })),
]
  .sort(
    (a, b) =>
      b.year - a.year ||
      b.popularity - a.popularity ||
      a.slug.localeCompare(b.slug)
  )
  .slice(0, 100);

const truncate = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max).trimEnd()}...` : value;

export const GET: APIRoute = () => {
  const items = feedItems
    .map(item => {
      const description = escapeXml(truncate(item.description, 300));
      const title = escapeXml(item.title);
      return `  <item>
    <title>${title}</title>
    <link>${item.url}</link>
    <guid>${item.url}</guid>
    <description>${description}</description>
    <category>${escapeXml(item.category)}</category>
  </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CNMemes — Chinese Internet Meme Dictionary</title>
    <link>${SITE}</link>
    <description>The most complete English-language dictionary of Chinese internet memes. Updated regularly.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
