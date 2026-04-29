const { getGroupTimeRecords, getMostTimeSpentTab, getTotalTime } = require('./groupTabTimeTracker');
const { getAllGroups } = require('./manager');

function formatMs(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function getTimeSummary(groupId) {
  const records = getGroupTimeRecords(groupId);
  const tabIds = Object.keys(records);
  const totalMs = tabIds.reduce((sum, tabId) => sum + (records[tabId].totalMs || 0), 0);
  const mostSpent = getMostTimeSpentTab(groupId);
  return {
    groupId,
    trackedTabCount: tabIds.length,
    totalTrackedMs: totalMs,
    totalTrackedFormatted: formatMs(totalMs),
    mostTimeSpentTab: mostSpent
  };
}

function getGroupsWithTracking() {
  const groups = getAllGroups();
  return groups.filter(g => Object.keys(getGroupTimeRecords(g.id)).length > 0).map(g => g.id);
}

function getTopTimeGroups(limit = 5) {
  const groups = getAllGroups();
  const summaries = groups.map(g => {
    const records = getGroupTimeRecords(g.id);
    const totalMs = Object.values(records).reduce((sum, r) => sum + (r.totalMs || 0), 0);
    return { groupId: g.id, totalMs };
  });
  return summaries.sort((a, b) => b.totalMs - a.totalMs).slice(0, limit);
}

module.exports = { getTimeSummary, getGroupsWithTracking, getTopTimeGroups, formatMs };
