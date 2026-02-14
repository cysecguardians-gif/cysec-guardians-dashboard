// cache.js
// Global Reactive Cache Layer

import { logEvent } from "./observability.js";

/* ======================================================
   INTERNAL STORAGE
====================================================== */

const cache = {};
const listeners = new Map();

/* ======================================================
   GET CACHE
====================================================== */

export function getCache(key) {
  return cache[key];
}

/* ======================================================
   SET CACHE
====================================================== */

export function setCache(key, value) {

  cache[key] = value;

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
   REMOVE CACHE (optional helper)
====================================================== */

export function clearCache(key) {

  delete cache[key];

  logEvent("CACHE", `Cleared: ${key}`);

  if (listeners.has(key)) {
    listeners.get(key).forEach(fn => fn(undefined));
  }
}

/* ======================================================
   CLEAR ALL CACHE
====================================================== */

export function clearAllCache() {
  Object.keys(cache).forEach(k => delete cache[k]);
  logEvent("CACHE", "Cleared all cache");
}

/* ======================================================
   SUBSCRIBE TO CACHE KEY
====================================================== */

export function subscribeCache(key, fn) {

  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }

  listeners.get(key).add(fn);

  // immediate push if data exists
  if (cache[key] !== undefined) {
    try {
      fn(cache[key]);
    } catch (err) {
      console.error("Cache immediate callback error:", err);
    }
  }

  return () => {
    listeners.get(key)?.delete(fn);
  };
}
