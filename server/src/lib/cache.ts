import LRU from "lru-cache";
import { env } from "../config/env";


export const cache = new LRU<string, unknown>({
max: 1000,
ttl: env.CACHE_TTL_SECONDS * 1000,
});


export function memoize<T>(key: string, fn: () => Promise<T>, ttlMs?: number): Promise<T> {
const cached = cache.get(key) as T | undefined;
if (cached !== undefined) return Promise.resolve(cached);
return fn().then((val) => {
cache.set(key, val as unknown, { ttl: ttlMs });
return val;
});
}