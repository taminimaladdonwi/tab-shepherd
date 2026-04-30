const { getMutedTabsInGroup, getAllMuted, getMuteReasonDistribution } = require('./groupTabMutedTracker');
const { getAllGroups } = require('./manager');

function getMuteSummary(groupId, tabs = []) {
  const muted = getMutedTabsInGroup(groupId);
  const mutedIds = new Set(muted.map(r => r.tabId));
  return {
    groupId,
    totalTabs: tabs.length,
    mutedCount: muted.length,
    unmutedCount: tabs.filter(t => !mutedIds.has(t.id)).length,
    reasons: muted.map(r => r.reason)
  };
}

function getMostMutedGroup() {
  const all = getAllMuted();
  const counts = {};
  for (const record of all) {
    counts[record.groupId] = (counts[record.groupId] || 0) + 1;
  }
  let top = null;
  let max = 0;
  for (const [groupId, count] of Object.entries(counts)) {
    if (count > max) { max = count; top = groupId; }
  }
  return top ? { groupId: top, mutedCount: max } : null;
}

function getGroupsWithMutedTabs() {
  const all = getAllMuted();
  const seen = new Set();
  return all.reduce((acc, r) => {
    if (!seen.has(r.groupId)) { seen.add(r.groupId); acc.push(r.groupId); }
    return acc;
  }, []);
}

function getUnmutedGroups() {
  const groups = getAllGroups();
  const mutedGroupIds = new Set(getGroupsWithMutedTabs());
  return groups.filter(g => !mutedGroupIds.has(g.id)).map(g => g.id);
}

module.exports = {
  getMuteSummary,
  getMostMutedGroup,
  getGroupsWithMutedTabs,
  getUnmutedGroups
};
