/**
 * Tracks tab activity and determines inactivity duration.
 */

const tabLastActive = new Map();

/**
 * Record the current time as the last active timestamp for a tab.
 * @param {number} tabId
 */
export function recordActivity(tabId) {
  tabLastActive.set(tabId, Date.now());
}

/**
 * Get the number of milliseconds since a tab was last active.
 * @param {number} tabId
 * @returns {number} milliseconds inactive, or Infinity if never recorded
 */
export function getInactiveDuration(tabId) {
  if (!tabLastActive.has(tabId)) return Infinity;
  return Date.now() - tabLastActive.get(tabId);
}

/**
 * Remove tracking data for a tab (e.g. when it is closed).
 * @param {number} tabId
 */
export function removeTab(tabId) {
  tabLastActive.delete(tabId);
}

/**
 * Return all tab IDs whose inactivity exceeds the given threshold.
 * @param {number} thresholdMs
 * @returns {number[]}
 */
export function getIdleTabs(thresholdMs) {
  const idle = [];
  for (const [tabId, lastActive] of tabLastActive.entries()) {
    if (Date.now() - lastActive >= thresholdMs) {
      idle.push(tabId);
    }
  }
  return idle;
}

/**
 * Clear all tracking data (useful for tests / reset).
 */
export function clearAll() {
  tabLastActive.clear();
}
