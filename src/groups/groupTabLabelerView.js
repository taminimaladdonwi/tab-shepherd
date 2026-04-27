// groupTabLabelerView.js — Read-only views over groupTabLabeler data

const { getLabelsForGroup, getAllLabels } = require('./groupTabLabeler');
const { getAllGroups } = require('./manager');

function getLabelSummary(groupId) {
  const labelsForGroup = getLabelsForGroup(groupId);
  const entries = Object.entries(labelsForGroup);
  return {
    groupId,
    labeledTabCount: entries.length,
    labels: labelsForGroup
  };
}

function getLabeledTabTitles(groupId, tabs) {
  const labelsForGroup = getLabelsForGroup(groupId);
  return tabs
    .filter(tab => labelsForGroup[String(tab.id)] !== undefined)
    .map(tab => ({
      tabId: tab.id,
      title: tab.title,
      label: labelsForGroup[String(tab.id)]
    }));
}

function getGroupsWithLabels() {
  const all = getAllLabels();
  const groupIds = new Set(
    Object.keys(all).map(key => key.split('::')[0])
  );
  return [...groupIds];
}

function getMostLabeledGroup() {
  const groups = getAllGroups();
  let top = null;
  let topCount = -1;
  for (const group of groups) {
    const count = Object.keys(getLabelsForGroup(group.id)).length;
    if (count > topCount) {
      topCount = count;
      top = { groupId: group.id, labelCount: count };
    }
  }
  return top;
}

module.exports = {
  getLabelSummary,
  getLabeledTabTitles,
  getGroupsWithLabels,
  getMostLabeledGroup
};
