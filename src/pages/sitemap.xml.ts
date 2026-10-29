import type { APIRoute } from 'astro';
import { SITE, sitemapEntries } from '../utils/site';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = sitemapEntries()
    .map(
      entry =>
        `  <url><loc>${escapeXml(SITE + entry.path)}</loc>` +
        `<changefreq>${entry.changefreq}</changefreq>` +
        `<priority>${entry.priority}</priority>` +
        `<lastmod>${lastmod}</lastmod></url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
