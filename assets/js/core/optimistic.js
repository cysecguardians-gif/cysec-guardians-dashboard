// optimistic.js
import { setCache, getCache } from "./cache.js";

/* ======================================================
   OPTIMISTIC UPDATE
====================================================== */

export function optimisticUpdate(key, updater) {

  const current = getCache(key);

  const updated =
    typeof updater === "function"
      ? updater(current)
      : updater;

  setCache(key, updated);
}
