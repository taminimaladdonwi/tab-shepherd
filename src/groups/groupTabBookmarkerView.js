// groupTabBookmarkerView.js — view helpers for tab bookmarks

const { getBookmarksForGroup, getAllBookmarks } = require('./groupTabBookmarker');

function getBookmarkSummary(groupId) {
  const entries = getBookmarksForGroup(groupId);
  return {
    groupId,
    total: entries.length,
    labeled: entries.filter(e => e.label.length > 0).length,
    unlabeled: entries.filter(e => e.label.length === 0).length
  };
}

function getBookmarkedTabTitles(groupId) {
  return getBookmarksForGroup(groupId).map(e => e.title || e.url);
}

function getMostBookmarkedGroup() {
  const counts = {};
  for (const entry of getAllBookmarks()) {
    counts[entry.groupId] = (counts[entry.groupId] || 0) + 1;
  }
  let topGroup = null;
  let topCount = 0;
  for (const [groupId, count] of Object.entries(counts)) {
    if (count > topCount) {
      topGroup = groupId;
      topCount = count;
    }
  }
  return topGroup ? { groupId: topGroup, count: topCount } : null;
}

function getGroupsWithBookmarks() {
  const seen = new Set();
  for (const entry of getAllBookmarks()) seen.add(entry.groupId);
  return Array.from(seen);
}

module.exports = {
  getBookmarkSummary,
  getBookmarkedTabTitles,
  getMostBookmarkedGroup,
  getGroupsWithBookmarks
};
