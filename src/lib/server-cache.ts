const cache = new Map<string, { data: unknown; timestamp: number }>();

export function getCached<T>(key: string, ttlMs: number): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttlMs) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

export function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Clean old entries periodically (every 10 min)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 min max
    for (const [key, entry] of cache) {
      if (now - entry.timestamp > maxAge) {
        cache.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}
