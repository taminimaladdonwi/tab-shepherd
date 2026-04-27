// groupTabTaggerView.js — Read-only views over tab tag data

const { getTabTags, getAllTabTagsInGroup } = require('./groupTabTagger');

function getTagSummary(groupId, tabs) {
  const all = getAllTabTagsInGroup(groupId, tabs);
  const tagCount = {};
  for (const tags of Object.values(all)) {
    for (const tag of tags) {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    }
  }
  return {
    totalTaggedTabs: Object.keys(all).length,
    totalTags: Object.values(tagCount).reduce((a, b) => a + b, 0),
    uniqueTags: Object.keys(tagCount),
    tagFrequency: tagCount
  };
}

function getMostTaggedTab(groupId, tabs) {
  let best = null;
  let max = 0;
  for (const tab of tabs) {
    const tags = getTabTags(groupId, tab.id);
    if (tags.length > max) {
      max = tags.length;
      best = { tab, tags };
    }
  }
  return best;
}

function getUntaggedTabs(groupId, tabs) {
  return tabs.filter(tab => getTabTags(groupId, tab.id).length === 0);
}

function getTabsWithTag(groupId, tabs, tag) {
  return tabs
    .filter(tab => getTabTags(groupId, tab.id).includes(tag))
    .map(tab => ({ tabId: tab.id, title: tab.title || tab.url }));
}

module.exports = {
  getTagSummary,
  getMostTaggedTab,
  getUntaggedTabs,
  getTabsWithTag
};
