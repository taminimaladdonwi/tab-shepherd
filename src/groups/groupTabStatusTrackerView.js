import { getGroupStatuses } from './groupTabStatusTracker.js';

/**
 * Returns a summary of tab statuses for a given group.
 * @param {string} groupId
 * @returns {{ groupId: string, total: number, byStatus: Record<string, number> }}
 */
export function getStatusSummary(groupId) {
  const statuses = getGroupStatuses(groupId);
  const byStatus = {};
  for (const status of Object.values(statuses)) {
    byStatus[status] = (byStatus[status] || 0) + 1;
  }
  return { groupId, total: Object.keys(statuses).length, byStatus };
}

/**
 * Returns a list of group IDs that have at least one tab with the given status.
 * @param {string} status
 * @returns {string[]}
 */
export function getGroupsWithStatus(status) {
  // We need to inspect all known groups; groupTabStatusTracker exposes getAllStatuses
  const { getAllStatuses } = require('./groupTabStatusTracker.js');
  const all = getAllStatuses();
  const result = [];
  for (const [groupId, tabMap] of Object.entries(all)) {
    if (Object.values(tabMap).includes(status)) {
      result.push(groupId);
    }
  }
  return result;
}

/**
 * Returns the group ID with the highest number of suspended tabs, or null.
 * @returns {string|null}
 */
export function getMostSuspendedGroup() {
  const { getAllStatuses } = require('./groupTabStatusTracker.js');
  const all = getAllStatuses();
  let topGroup = null;
  let topCount = 0;
  for (const [groupId, tabMap] of Object.entries(all)) {
    const count = Object.values(tabMap).filter(s => s === 'suspended').length;
    if (count > topCount) {
      topCount = count;
      topGroup = groupId;
    }
  }
  return topGroup;
}

/**
 * Returns the total count of each status value across all groups.
 * @returns {Record<string, number>}
 */
export function getStatusDistribution() {
  const { getAllStatuses } = require('./groupTabStatusTracker.js');
  const all = getAllStatuses();
  const dist = {};
  for (const tabMap of Object.values(all)) {
    for (const status of Object.values(tabMap)) {
      dist[status] = (dist[status] || 0) + 1;
    }
  }
  return dist;
}
