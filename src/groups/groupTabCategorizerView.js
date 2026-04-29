const {
  getCategoriesForGroup,
  getTabsByCategory,
  getCategoryDistribution,
  VALID_CATEGORIES
} = require('./groupTabCategorizer');
const { getAllGroups } = require('./manager');

function getCategorySummary(groupId) {
  const entries = getCategoriesForGroup(groupId);
  const tabIds = Object.keys(entries);
  const distribution = getCategoryDistribution(groupId);
  const dominantCategory = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0];
  return {
    groupId,
    totalCategorized: tabIds.length,
    distribution,
    dominantCategory: dominantCategory && dominantCategory[1] > 0 ? dominantCategory[0] : null
  };
}

function getUncategorizedGroups(tabs) {
  const groups = getAllGroups();
  return Object.keys(groups).filter(groupId => {
    const groupTabs = groups[groupId].tabs || [];
    const entries = getCategoriesForGroup(groupId);
    return groupTabs.length > 0 && Object.keys(entries).length === 0;
  });
}

function getMostCategorizedGroup() {
  const groups = getAllGroups();
  let best = null;
  let bestCount = -1;
  for (const groupId of Object.keys(groups)) {
    const entries = getCategoriesForGroup(groupId);
    const count = Object.keys(entries).length;
    if (count > bestCount) {
      bestCount = count;
      best = groupId;
    }
  }
  return best ? { groupId: best, count: bestCount } : null;
}

function getTabsInCategoryAcrossGroups(category) {
  const groups = getAllGroups();
  const result = {};
  for (const groupId of Object.keys(groups)) {
    const tabs = getTabsByCategory(groupId, category);
    if (tabs.length > 0) result[groupId] = tabs;
  }
  return result;
}

module.exports = {
  getCategorySummary,
  getUncategorizedGroups,
  getMostCategorizedGroup,
  getTabsInCategoryAcrossGroups
};
