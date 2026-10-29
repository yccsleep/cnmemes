/**
 * Deterministic shuffle so repeated builds of unchanged content produce
 * identical HTML (stable caches and diffs). The seed controls rotation:
 * pass a month key to refresh curated picks monthly, or a slug for
 * per-page stable variety.
 */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  h = h || 1;

  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    const j = h % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** UTC year-month key, e.g. "2026-10" — picks rotate once per month. */
export function monthSeed(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}
