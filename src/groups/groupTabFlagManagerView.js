// groupTabFlagManagerView.js
// View utilities for summarizing and reporting tab flags across groups

const { getFlags, getTabsWithFlag, getSupportedFlags } = require('./groupTabFlagManager');

function getFlagSummary(groupId, tabs) {
  const summary = {};
  for (const flag of getSupportedFlags()) {
    summary[flag] = getTabsWithFlag(groupId, tabs, flag).length;
  }
  return summary;
}

function getFlagDistribution(groupId, tabs) {
  const dist = {};
  for (const tab of tabs) {
    const tabFlags = getFlags(groupId, tab.id);
    for (const flag of tabFlags) {
      dist[flag] = (dist[flag] || 0) + 1;
    }
  }
  return dist;
}

function getMostFlaggedTab(groupId, tabs) {
  let best = null;
  let max = 0;
  for (const tab of tabs) {
    const count = getFlags(groupId, tab.id).length;
    if (count > max) {
      max = count;
      best = tab;
    }
  }
  return best ? { tab: best, flagCount: max } : null;
}

function getUnflaggedTabs(groupId, tabs) {
  return tabs.filter(tab => getFlags(groupId, tab.id).length === 0);
}

module.exports = {
  getFlagSummary,
  getFlagDistribution,
  getMostFlaggedTab,
  getUnflaggedTabs
};
