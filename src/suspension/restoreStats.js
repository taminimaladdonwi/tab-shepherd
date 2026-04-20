import { getRestoreHistory, getRestoresByGroup } from './restoreHistory.js';

/**
 * Returns the total number of tab restores recorded.
 * @returns {number}
 */
export function getTotalRestoreCount() {
  return getRestoreHistory().length;
}

/**
 * Returns restore counts keyed by groupId.
 * @returns {Object.<string, number>}
 */
export function getRestoreCountByGroup() {
  const history = getRestoreHistory();
  return history.reduce((acc, entry) => {
    const key = entry.groupId || 'ungrouped';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Returns the average time between restores in milliseconds.
 * Returns null if fewer than 2 restores exist.
 * @returns {number|null}
 */
export function getAverageTimeBetweenRestores() {
  const history = [...getRestoreHistory()].sort((a, b) => a.restoredAt - b.restoredAt);
  if (history.length < 2) return null;
  let totalGap = 0;
  for (let i = 1; i < history.length; i++) {
    totalGap += history[i].restoredAt - history[i - 1].restoredAt;
  }
  return totalGap / (history.length - 1);
}

/**
 * Returns the most frequently restored group.
 * Returns null if no history exists.
 * @returns {{ groupId: string, count: number }|null}
 */
export function getMostRestoredGroup() {
  const counts = getRestoreCountByGroup();
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;
  const [groupId, count] = entries.reduce((max, cur) => cur[1] > max[1] ? cur : max);
  return { groupId, count };
}

/**
 * Returns a summary stats object for a specific group.
 * @param {string} groupId
 * @returns {{ groupId: string, totalRestores: number, lastRestoredAt: number|null }}
 */
export function getGroupRestoreSummary(groupId) {
  const restores = getRestoresByGroup(groupId);
  const lastRestoredAt = restores.length
    ? Math.max(...restores.map(r => r.restoredAt))
    : null;
  return { groupId, totalRestores: restores.length, lastRestoredAt };
}

/**
 * Returns the number of restores that occurred within the given time window
 * (in milliseconds) relative to now.
 * @param {number} windowMs - The time window in milliseconds (e.g. 60000 for last minute).
 * @returns {number}
 */
export function getRestoreCountInWindow(windowMs) {
  const cutoff = Date.now() - windowMs;
  return getRestoreHistory().filter(entry => entry.restoredAt >= cutoff).length;
}
