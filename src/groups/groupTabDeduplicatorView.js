import { getDeduplicationHistory, getTotalRemovedCount } from './groupTabDeduplicator.js';
import { getAllGroups } from './manager.js';

/**
 * Returns a summary of all deduplication activity across groups.
 */
export function getDeduplicationSummary() {
  const history = getDeduplicationHistory();
  const totalRuns = history.length;
  const totalRemoved = getTotalRemovedCount();
  const groupsAffected = new Set(history.map(entry => entry.groupId)).size;

  return {
    totalRuns,
    totalRemoved,
    groupsAffected,
    averageRemovedPerRun: totalRuns > 0 ? +(totalRemoved / totalRuns).toFixed(2) : 0
  };
}

/**
 * Returns the group that has had the most duplicates removed across all runs.
 */
export function getMostDeduplicatedGroup() {
  const history = getDeduplicationHistory();
  if (history.length === 0) return null;

  const countByGroup = {};
  for (const entry of history) {
    countByGroup[entry.groupId] = (countByGroup[entry.groupId] || 0) + entry.removedCount;
  }

  const topGroupId = Object.entries(countByGroup)
    .sort(([, a], [, b]) => b - a)[0][0];

  return {
    groupId: topGroupId,
    totalRemoved: countByGroup[topGroupId]
  };
}

/**
 * Returns groups that have never had deduplication run on them.
 */
export function getUndeduplicatedGroups() {
  const allGroups = getAllGroups();
  const history = getDeduplicationHistory();
  const deduplicatedIds = new Set(history.map(entry => entry.groupId));

  return allGroups
    .filter(group => !deduplicatedIds.has(group.id))
    .map(group => group.id);
}
