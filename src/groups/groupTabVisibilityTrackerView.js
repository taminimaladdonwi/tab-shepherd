const {
  getAllVisibilityRecords,
  getGroupVisibility,
  getHiddenTabs,
  getVisibleTabs
} = require('./groupTabVisibilityTracker');

function getVisibilitySummary(groupId) {
  const records = getGroupVisibility(groupId);
  const visible = records.filter(r => r.state === 'visible').length;
  const hidden = records.filter(r => r.state === 'hidden').length;
  const unknown = records.filter(r => r.state === 'unknown').length;
  return { groupId, total: records.length, visible, hidden, unknown };
}

function getMostHiddenGroup() {
  const all = getAllVisibilityRecords();
  const counts = {};
  for (const record of all) {
    if (record.state === 'hidden') {
      counts[record.groupId] = (counts[record.groupId] || 0) + 1;
    }
  }
  let topGroup = null;
  let topCount = 0;
  for (const [groupId, count] of Object.entries(counts)) {
    if (count > topCount) {
      topGroup = groupId;
      topCount = count;
    }
  }
  return topGroup ? { groupId: topGroup, hiddenCount: topCount } : null;
}

function getGroupsWithAllHidden(groupIds) {
  return groupIds.filter(groupId => {
    const records = getGroupVisibility(groupId);
    return records.length > 0 && records.every(r => r.state === 'hidden');
  });
}

function getVisibilityDistribution() {
  const all = getAllVisibilityRecords();
  const dist = { visible: 0, hidden: 0, unknown: 0 };
  for (const record of all) {
    if (dist[record.state] !== undefined) dist[record.state]++;
  }
  return dist;
}

module.exports = {
  getVisibilitySummary,
  getMostHiddenGroup,
  getGroupsWithAllHidden,
  getVisibilityDistribution
};
