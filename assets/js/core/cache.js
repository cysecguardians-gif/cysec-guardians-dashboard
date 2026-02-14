// cache.js
// Global Reactive Cache with Smart TTL

import { logEvent } from "./observability.js";

/* ======================================================
   INTERNAL STORAGE
====================================================== */

const cache = {};
const listeners = new Map();

/* ======================================================
   DEFAULT TTLs (ms)
====================================================== */

const DEFAULT_TTL = 5 * 60 * 1000; // 5 min

const TTL_MAP = {
  dashboard_summary: 30000,      // 30s
  phishing_campaigns: 30000,
  phishing_trend: 60000,
  department_risk: 180000,
  users_list: 300000
};

/* ======================================================
   HELPERS
====================================================== */

function now() {
  return Date.now();
}

function isExpired(entry) {
  if (!entry) return true;
  return entry.expiresAt <= now();
}

/* ======================================================
   GET CACHE
====================================================== */

export function getCache(key) {

  const entry = cache[key];

  if (!entry) return undefined;

  if (isExpired(entry)) {

    logEvent("CACHE", `Expired: ${key}`);

    delete cache[key];
    return undefined;
  }

  return entry.data;
}

/* ======================================================
   SET CACHE
====================================================== */

export function setCache(key, value, ttl) {

  const ttlValue =
    ttl ||
    TTL_MAP[key] ||
    DEFAULT_TTL;

  cache[key] = {
    data: value,
    expiresAt: now() + ttlValue
  };

  logEvent("CACHE", `Updated: ${key}`);

  // notify listeners
  if (listeners.has(key)) {
    listeners.get(key).forEach(fn => {
      try {
        fn(value);
      } catch (err) {
        console.error("Cache listener error:", err);
      }
    });
  }
}

/* ======================================================
   CLEAR CACHE
====================================================== */

export function clearCache(key) {

  delete cache[key];

  logEvent("CACHE", `Cleared: ${key}`);

  if (listeners.has(key)) {
    listeners.get(key).forEach(fn => fn(undefined));
  }
}

/* ======================================================
   CLEAR ALL
====================================================== */

export function clearAllCache() {
  Object.keys(cache).forEach(k => delete cache[k]);
  logEvent("CACHE", "Cleared all cache");
}

/* ======================================================
   SUBSCRIBE
====================================================== */

export function subscribeCache(key, fn) {

  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }

  listeners.get(key).add(fn);

  const value = getCache(key);
  if (value !== undefined) {
    try {
      fn(value);
    } catch (err) {
      console.error("Cache immediate callback error:", err);
    }
  }

  return () => {
    listeners.get(key)?.delete(fn);
  };
}
