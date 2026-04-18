// sessionSnapshot.js — captures and restores snapshots of tab groups for session persistence

const snapshots = new Map();

/**
 * @param {string} sessionId
 * @param {Array<{tabId: number, groupId: string, url: string, title: string}>} tabs
 */
function saveSnapshot(sessionId, tabs) {
  if (!sessionId || !Array.isArray(tabs)) throw new Error('Invalid snapshot input');
  snapshots.set(sessionId, {
    sessionId,
    tabs,
    savedAt: Date.now(),
  });
}

/**
 * @param {string} sessionId
 * @returns {object|null}
 */
function getSnapshot(sessionId) {
  return snapshots.get(sessionId) || null;
}

/**
 * @returns {object[]}
 */
function getAllSnapshots() {
  return Array.from(snapshots.values());
}

/**
 * @param {string} sessionId
 * @returns {boolean}
 */
function deleteSnapshot(sessionId) {
  return snapshots.delete(sessionId);
}

/**
 * @param {string} sessionId
 * @returns {number}
 */
function getSnapshotAge(sessionId) {
  const snap = snapshots.get(sessionId);
  if (!snap) return -1;
  return Date.now() - snap.savedAt;
}

function clearAllSnapshots() {
  snapshots.clear();
}

module.exports = {
  saveSnapshot,
  getSnapshot,
  getAllSnapshots,
  deleteSnapshot,
  getSnapshotAge,
  clearAllSnapshots,
};
