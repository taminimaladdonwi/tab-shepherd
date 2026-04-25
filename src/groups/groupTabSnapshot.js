/**
 * groupTabSnapshot.js
 * Captures and manages point-in-time snapshots of tab lists within groups.
 */

const snapshots = new Map();

/**
 * Take a snapshot of the current tabs in a group.
 * @param {string} groupId
 * @param {Array<{id: number, url: string, title: string}>} tabs
 * @returns {object} snapshot record
 */
function takeSnapshot(groupId, tabs) {
  if (!groupId || !Array.isArray(tabs)) {
    throw new Error('groupId and tabs array are required');
  }

  const snapshot = {
    groupId,
    timestamp: Date.now(),
    tabs: tabs.map(({ id, url, title }) => ({ id, url, title })),
    count: tabs.length,
  };

  if (!snapshots.has(groupId)) {
    snapshots.set(groupId, []);
  }

  snapshots.get(groupId).push(snapshot);
  return snapshot;
}

/**
 * Get all snapshots for a group, ordered oldest-first.
 * @param {string} groupId
 * @returns {Array<object>}
 */
function getSnapshots(groupId) {
  return snapshots.get(groupId) || [];
}

/**
 * Get the most recent snapshot for a group.
 * @param {string} groupId
 * @returns {object|null}
 */
function getLatestSnapshot(groupId) {
  const list = snapshots.get(groupId);
  if (!list || list.length === 0) return null;
  return list[list.length - 1];
}

/**
 * Compare the latest snapshot to a current tab list and return a diff.
 * @param {string} groupId
 * @param {Array<{id: number, url: string, title: string}>} currentTabs
 * @returns {{ added: Array, removed: Array, unchanged: Array }}
 */
function diffWithLatest(groupId, currentTabs) {
  const latest = getLatestSnapshot(groupId);
  if (!latest) return { added: [...currentTabs], removed: [], unchanged: [] };

  const prevIds = new Set(latest.tabs.map((t) => t.id));
  const currIds = new Set(currentTabs.map((t) => t.id));

  const added = currentTabs.filter((t) => !prevIds.has(t.id));
  const removed = latest.tabs.filter((t) => !currIds.has(t.id));
  const unchanged = currentTabs.filter((t) => prevIds.has(t.id));

  return { added, removed, unchanged };
}

/**
 * Delete all snapshots for a group.
 * @param {string} groupId
 */
function clearSnapshots(groupId) {
  snapshots.delete(groupId);
}

/**
 * Clear all snapshot data (used in tests).
 */
function clearAll() {
  snapshots.clear();
}

module.exports = {
  takeSnapshot,
  getSnapshots,
  getLatestSnapshot,
  diffWithLatest,
  clearSnapshots,
  clearAll,
};
