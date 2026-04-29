const { getPinnedTabsInGroup, getAllPinnedTabs } = require('./groupTabPinTracker');

function getPinSummary(groupId) {
  const pinned = getPinnedTabsInGroup(groupId);
  return {
    groupId,
    pinnedCount: pinned.length,
    reasons: [...new Set(pinned.map(p => p.reason))],
    tabIds: pinned.map(p => p.tabId)
  };
}

function getMostPinnedGroup(groups) {
  let max = -1;
  let result = null;
  for (const groupId of groups) {
    const count = getPinnedTabsInGroup(groupId).length;
    if (count > max) {
      max = count;
      result = groupId;
    }
  }
  return result ? { groupId: result, pinnedCount: max } : null;
}

function getGroupsWithPinnedTabs(groups) {
  return groups.filter(groupId => getPinnedTabsInGroup(groupId).length > 0);
}

function getUnpinnedGroups(groups) {
  return groups.filter(groupId => getPinnedTabsInGroup(groupId).length === 0);
}

function getPinReasonDistribution() {
  const all = getAllPinnedTabs();
  const dist = {};
  for (const { reason } of all) {
    dist[reason] = (dist[reason] || 0) + 1;
  }
  return dist;
}

module.exports = {
  getPinSummary,
  getMostPinnedGroup,
  getGroupsWithPinnedTabs,
  getUnpinnedGroups,
  getPinReasonDistribution
};
