// cache.js
// Global Live Data Cache

const cache = {};
const listeners = new Map();

/* ======================================================
   GET
====================================================== */

export function getCache(key) {
  return cache[key];
}

/* ======================================================
   SET
====================================================== */

export function setCache(key, value) {
  cache[key] = value;

  if (listeners.has(key)) {
    listeners.get(key).forEach(fn => fn(value));
  }
}

/* ======================================================
   SUBSCRIBE
====================================================== */

export function subscribeCache(key, fn) {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }

  listeners.get(key).add(fn);

  return () => {
    listeners.get(key)?.delete(fn);
  };
}
