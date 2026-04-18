const { getAllGroups } = require('./manager');
const { getTags } = require('./tagger');
const { isArchived } = require('./groupArchiver');

function getGroupTabCount(groupId) {
  const { getGroup } = require('./manager');
  const group = getGroup(groupId);
  if (!group) return 0;
  return (group.tabs || []).length;
}

function getTotalTabCount() {
  const groups = getAllGroups();
  return groups.reduce((sum, g) => sum + (g.tabs || []).length, 0);
}

function getAverageTabsPerGroup() {
  const groups = getAllGroups();
  if (groups.length === 0) return 0;
  return getTotalTabCount() / groups.length;
}

function getLargestGroup() {
  const groups = getAllGroups();
  if (groups.length === 0) return null;
  return groups.reduce((max, g) =>
    (g.tabs || []).length > (max.tabs || []).length ? g : max
  );
}

function getGroupSummary() {
  const groups = getAllGroups();
  return groups.map(g => ({
    id: g.id,
    name: g.name,
    tabCount: (g.tabs || []).length,
    tags: getTags(g.id),
    archived: isArchived(g.id)
  }));
}

function getActiveGroupCount() {
  const groups = getAllGroups();
  return groups.filter(g => !isArchived(g.id)).length;
}

module.exports = {
  getGroupTabCount,
  getTotalTabCount,
  getAverageTabsPerGroup,
  getLargestGroup,
  getGroupSummary,
  getActiveGroupCount
};
