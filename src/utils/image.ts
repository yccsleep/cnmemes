import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Return the WebP variant of a public image path, or null when it doesn't exist.
 * Components use this to decide whether to emit a <source type="image/webp">,
 * so a missing WebP never produces a broken picture.
 */
export function webpSrc(image: string): string | null {
  if (!image.startsWith('/')) return null;
  const webp = image.replace(/\.(jpe?g|png|gif)$/i, '.webp');
  if (webp === image) return null;
  return existsSync(join(process.cwd(), 'public', webp)) ? webp : null;
}
