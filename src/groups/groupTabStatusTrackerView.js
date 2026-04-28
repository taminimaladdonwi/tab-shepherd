/**
 * groupTabStatusTrackerView.js
 * View helpers for summarizing and querying tab status data across groups.
 */

const { getStatusesForGroup, getTabsByStatus, getStatusCounts, VALID_STATUSES } = require('./groupTabStatusTracker');
const { getAllGroups } = require('./manager');

function getStatusSummary(groupId) {
  const counts = getStatusCounts(groupId);
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return { groupId, total, counts };
}

function getGroupsWithStatus(status) {
  const groups = getAllGroups();
  return groups
    .map(g => ({ groupId: g.id, tabs: getTabsByStatus(g.id, status) }))
    .filter(entry => entry.tabs.length > 0);
}

function getMostSuspendedGroup() {
  const groups = getAllGroups();
  let best = null;
  let bestCount = -1;
  for (const g of groups) {
    const tabs = getTabsByStatus(g.id, 'suspended');
    if (tabs.length > bestCount) {
      bestCount = tabs.length;
      best = { groupId: g.id, count: tabs.length };
    }
  }
  return best;
}

function getStatusDistribution() {
  const groups = getAllGroups();
  const distribution = Object.fromEntries(VALID_STATUSES.map(s => [s, 0]));
  for (const g of groups) {
    const counts = getStatusCounts(g.id);
    for (const status of VALID_STATUSES) {
      distribution[status] += counts[status] || 0;
    }
  }
  return distribution;
}

module.exports = {
  getStatusSummary,
  getGroupsWithStatus,
  getMostSuspendedGroup,
  getStatusDistribution
};
