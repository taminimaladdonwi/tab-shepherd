/**
 * groupTabLinkerView.js
 * View utilities for summarizing and querying tab link data.
 */

const { getAllLinks, getLinks, getSupportedRelations } = require('./groupTabLinker');

function getLinkSummary() {
  const allLinks = getAllLinks();
  const relationCounts = {};
  for (const rel of getSupportedRelations()) {
    relationCounts[rel] = 0;
  }
  for (const link of allLinks) {
    if (relationCounts[link.relation] !== undefined) {
      relationCounts[link.relation]++;
    }
  }
  return {
    totalLinks: allLinks.length,
    byRelation: relationCounts
  };
}

function getMostLinkedTab(groupId, tabs) {
  if (!tabs || tabs.length === 0) return null;
  let maxCount = -1;
  let mostLinked = null;
  for (const tab of tabs) {
    const count = getLinks(groupId, tab.id).length;
    if (count > maxCount) {
      maxCount = count;
      mostLinked = { tab, linkCount: count };
    }
  }
  return mostLinked;
}

function getLinkedTabIds(groupId, tabId) {
  return getLinks(groupId, tabId).map(l => ({
    groupId: l.toGroupId,
    tabId: l.toTabId,
    relation: l.relation
  }));
}

function getCrossGroupLinks() {
  return getAllLinks().filter(l => l.fromGroupId !== l.toGroupId);
}

module.exports = {
  getLinkSummary,
  getMostLinkedTab,
  getLinkedTabIds,
  getCrossGroupLinks
};
