/**
 * groupTabCounter.js
 * Tracks and queries tab count changes over time per group.
 */

const history = new Map();

/**
 * Records a tab count snapshot for a group.
 * @param {string} groupId
 * @param {number} count
 */
function recordCount(groupId, count) {
  if (typeof count !== 'number' || count < 0) {
    throw new Error('count must be a non-negative number');
  }
  if (!history.has(groupId)) {
    history.set(groupId, []);
  }
  history.get(groupId).push({ count, timestamp: Date.now() });
}

/**
 * Returns the full count history for a group.
 * @param {string} groupId
 * @returns {Array<{count: number, timestamp: number}>}
 */
function getCountHistory(groupId) {
  return history.get(groupId) || [];
}

/**
 * Returns the most recent recorded count for a group.
 * @param {string} groupId
 * @returns {number|null}
 */
function getLatestCount(groupId) {
  const entries = history.get(groupId);
  if (!entries || entries.length === 0) return null;
  return entries[entries.length - 1].count;
}

/**
 * Returns the peak (maximum) tab count ever recorded for a group.
 * @param {string} groupId
 * @returns {number|null}
 */
function getPeakCount(groupId) {
  const entries = history.get(groupId);
  if (!entries || entries.length === 0) return null;
  return Math.max(...entries.map(e => e.count));
}

/**
 * Returns groups whose latest count exceeds the given threshold.
 * @param {number} threshold
 * @returns {string[]}
 */
function getGroupsExceedingCount(threshold) {
  const result = [];
  for (const [groupId] of history) {
    const latest = getLatestCount(groupId);
    if (latest !== null && latest > threshold) {
      result.push(groupId);
    }
  }
  return result;
}

/**
 * Clears all history for a specific group.
 * @param {string} groupId
 */
function clearGroupHistory(groupId) {
  history.delete(groupId);
}

/**
 * Clears all recorded history.
 */
function clearAll() {
  history.clear();
}

module.exports = {
  recordCount,
  getCountHistory,
  getLatestCount,
  getPeakCount,
  getGroupsExceedingCount,
  clearGroupHistory,
  clearAll
};
