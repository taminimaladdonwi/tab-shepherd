/**
 * groupTabUsageTracker.js
 * Tracks how frequently tabs within groups are accessed/activated.
 */

const usageMap = new Map(); // key: `${groupId}:${tabId}` => { count, lastAccessed }

function makeKey(groupId, tabId) {
  return `${groupId}:${tabId}`;
}

export function recordTabUsage(groupId, tabId) {
  if (!groupId || tabId == null) throw new Error('groupId and tabId are required');
  const key = makeKey(groupId, tabId);
  const existing = usageMap.get(key) || { count: 0, lastAccessed: null };
  usageMap.set(key, {
    count: existing.count + 1,
    lastAccessed: Date.now()
  });
}

export function getTabUsage(groupId, tabId) {
  return usageMap.get(makeKey(groupId, tabId)) || null;
}

export function getGroupUsage(groupId) {
  const result = [];
  for (const [key, data] of usageMap.entries()) {
    const [gid, tid] = key.split(':');
    if (gid === String(groupId)) {
      result.push({ tabId: Number(tid), ...data });
    }
  }
  return result;
}

export function getMostUsedTab(groupId) {
  const entries = getGroupUsage(groupId);
  if (!entries.length) return null;
  return entries.reduce((top, cur) => (cur.count > top.count ? cur : top));
}

export function getLeastUsedTabs(groupId, threshold = 1) {
  return getGroupUsage(groupId).filter(e => e.count <= threshold);
}

export function getUsageSummary(groupId) {
  const entries = getGroupUsage(groupId);
  if (!entries.length) return { total: 0, unique: 0, average: 0 };
  const total = entries.reduce((sum, e) => sum + e.count, 0);
  return {
    total,
    unique: entries.length,
    average: parseFloat((total / entries.length).toFixed(2))
  };
}

export function clearGroupUsage(groupId) {
  for (const key of [...usageMap.keys()]) {
    if (key.startsWith(`${groupId}:`)) usageMap.delete(key);
  }
}

export function clearAllUsage() {
  usageMap.clear();
}
