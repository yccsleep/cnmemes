# CNMemes · 中文梗典

An English-language dictionary of Chinese internet memes — word memes, image memes,
and the platforms that produced them. Built with [Astro](https://astro.build) and
deployed as a fully static site at **https://cnmemes.com**.

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # static build → dist/
npm run preview  # preview the built site
```

Requires Node 18+ (developed on Node 22).

## Content model

All content lives in JSON; pages are generated at build time. There is no CMS or API.

| File | Entries | Purpose |
|---|---|---|
| [src/data/memes.json](src/data/memes.json) | 535 | Text memes / slang (2002–2026) |
| [src/data/image-memes.json](src/data/image-memes.json) | 48 | Reaction images and visual formats |
| [src/data/platforms.json](src/data/platforms.json) | 10 | Weibo, Bilibili, Douyin, etc. |

### Text meme fields

`slug`, `chinese_name`, `pinyin`, `english_name`, `year`, `status`
(`still popular` / `classic` / `fading`), `tags[]`, `chinese_explanation`,
`english_explanation`, `cultural_context`, `examples[2]` (`{chinese, english}`),
`popularity` (1–5), `platform` (must match a `platforms.json` slug),
`origin_story`, `similar_expressions`.

### Image meme fields

Same core fields plus `image` (path under `/images/memes/`) and `usage`
(how the image is used as a reaction). Images are **not** counted in
`platforms.json.meme_count`, which tracks text memes only.

### Conventions

- **Tags** create `/tag/[tag]` pages. Tags from both data files are unioned, so
  image-only tags such as `reaction` get a page too.
- **Years** are grouped in the UI: 2002–2004 → `/year/2004`, 2005–2009 → `/year/2009`,
  2010–2014 → `/year/2014`; every year from 2015 onward gets its own page.
- `slug` must be unique and URL-safe (pinyin without tones).

## Adding memes

1. Export new entries from the meme-generator tool as `new_memes.json` in the repo root.
2. Merge and deduplicate (by `chinese_name`, auto-generates slugs):

   ```bash
   python3 merge_memes.py
   ```

3. For image memes, edit [image-memes.json](src/data/image-memes.json) manually and add
   the image to [public/images/memes/](public/images/memes/).

### Image requirements

- Provide the original (`.jpg`, `.png`, or `.gif`).
- Provide a WebP sibling with the same basename, e.g. `doge.jpg` + `doge.webp`.
  Animated GIFs need an animated WebP (`sharp(gif, { animated: true })`).
- `ImageMemeCard` only emits `<source type="image/webp">` when the `.webp` file
  actually exists, so a missing WebP falls back to the original safely.

## Build-time generation

The following are **generated on every build** and should not be edited by hand:

- `/sitemap.xml` — [src/pages/sitemap.xml.ts](src/pages/sitemap.xml.ts)
- `/rss.xml` — [src/pages/rss.xml.ts](src/pages/rss.xml.ts), latest 100 entries

Route lists live in [src/utils/site.ts](src/utils/site.ts); update it together with
any new `getStaticPaths` source.

## Configuration

Copy [.env.example](.env.example) to `.env` to enable manual AdSense units:

```env
PUBLIC_ADSENSE_SLOT_HOME=1234567890
PUBLIC_ADSENSE_SLOT_MEME=0987654321
```

Both values must be **numeric** ad-unit slot IDs from the AdSense dashboard. When
unset, the manual `<ins class="adsbygoogle">` units are omitted; Google Auto Ads
(if enabled for the site) still run.

Analytics and the AdSense client ID are set in
[src/layouts/Base.astro](src/layouts/Base.astro).

## Project layout

```
src/
  components/       MemeCard, ImageMemeCard
  data/             Content JSON
  layouts/Base.astro  Head, nav, footer, theme, analytics, CSP
  pages/            Routes (see table below)
  styles/global.css Design tokens, dark mode, shared components
  utils/            site routes, image WebP lookup, seeded shuffle
public/             Static assets + robots.txt/ads.txt + meme images
merge_memes.py      Monthly text-meme merge script
```

### Routes

| Route | Description |
|---|---|
| `/` | Curated home: search, trending, essentials, years, platforms, vibes |
| `/memes` | Full archive grouped by year + client-side search |
| `/top-memes` | All 5★ memes grouped by year |
| `/image-memes` | Image meme poster grid |
| `/meme/[slug]` | Text meme detail |
| `/image-meme/[slug]` | Image meme detail |
| `/tag/[tag]` | Tag listing (text + image memes) |
| `/year/[year]` | Era/year listing |
| `/platforms`, `/platform/[slug]` | Platform directory and detail |
| `/about`, `/404` | Static pages |

## Notes

- Search is client-side; the homepage embeds a trimmed index, and `/memes` embeds a
  180-character excerpt per entry to keep the page small.
- Curated picks (home sidebar, 404 suggestions, related fallback) use a seeded
  shuffle keyed by month or slug, so repeated builds of unchanged content are
  byte-stable while still rotating monthly.
- Every detail page emits `Article`, `FAQPage`, `DefinedTerm`, and `BreadcrumbList`
  JSON-LD for SEO.
