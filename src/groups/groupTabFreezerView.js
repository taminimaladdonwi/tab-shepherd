/**
 * groupTabFreezerView.js
 * Read-only view utilities for frozen tab data.
 */

const { getAllFrozen, getFrozenTabsInGroup } = require('./groupTabFreezer');
const { getAllGroups } = require('./manager');

function getFreezeSummary() {
  const all = getAllFrozen();
  const byGroup = {};
  for (const entry of all) {
    if (!byGroup[entry.groupId]) byGroup[entry.groupId] = 0;
    byGroup[entry.groupId]++;
  }
  return {
    totalFrozen: all.length,
    byGroup
  };
}

function getMostFrozenGroup() {
  const all = getAllFrozen();
  const counts = {};
  for (const entry of all) {
    counts[entry.groupId] = (counts[entry.groupId] || 0) + 1;
  }
  let top = null;
  let max = 0;
  for (const [groupId, count] of Object.entries(counts)) {
    if (count > max) { max = count; top = groupId; }
  }
  return top ? { groupId: top, count: max } : null;
}

function getGroupsWithFrozenTabs() {
  const groups = getAllGroups();
  return groups.filter(g => getFrozenTabsInGroup(g.id).length > 0)
    .map(g => ({
      groupId: g.id,
      name: g.name,
      frozenCount: getFrozenTabsInGroup(g.id).length
    }));
}

function getUnfrozenGroups() {
  const groups = getAllGroups();
  return groups.filter(g => getFrozenTabsInGroup(g.id).length === 0)
    .map(g => g.id);
}

module.exports = {
  getFreezeSummary,
  getMostFrozenGroup,
  getGroupsWithFrozenTabs,
  getUnfrozenGroups
};
