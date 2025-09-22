import { LRUCache } from "lru-cache";
import { env } from "../config/env";

export const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: env.CACHE_TTL_SECONDS * 1000,
});

export async function memoize<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs?: number
): Promise<T> {
  const cached = cache.get(key) as T | undefined;
  if (cached !== undefined) return cached;

  const val = await fn();
  cache.set(key, val as unknown, { ttl: ttlMs });
  return val;
}