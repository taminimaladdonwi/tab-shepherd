// groupTabAnnotatorView.js
// View helpers for summarising tab annotations across groups

const { getAnnotationsForGroup, getAllAnnotations } = require('./groupTabAnnotator');

function getAnnotationSummary(groupId) {
  const entries = getAnnotationsForGroup(groupId);
  const tabIds = Object.keys(entries);
  return {
    groupId,
    annotatedTabCount: tabIds.length,
    tabIds
  };
}

function getAnnotatedTabTitles(groupId, tabs = []) {
  const entries = getAnnotationsForGroup(groupId);
  return tabs
    .filter(tab => entries[String(tab.id)])
    .map(tab => ({
      tabId: tab.id,
      title: tab.title,
      note: entries[String(tab.id)].note
    }));
}

function getGroupsWithAnnotations() {
  const all = getAllAnnotations();
  const groupSet = new Set();
  for (const key of Object.keys(all)) {
    const [gid] = key.split('::');
    groupSet.add(gid);
  }
  return Array.from(groupSet);
}

function getMostAnnotatedGroup() {
  const all = getAllAnnotations();
  const counts = {};
  for (const key of Object.keys(all)) {
    const [gid] = key.split('::');
    counts[gid] = (counts[gid] || 0) + 1;
  }
  if (Object.keys(counts).length === 0) return null;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

module.exports = {
  getAnnotationSummary,
  getAnnotatedTabTitles,
  getGroupsWithAnnotations,
  getMostAnnotatedGroup
};
