// groupTabNotesView.js — View helpers for tab notes

const { getNotesForGroup, getAllNotes, getNoteCount } = require('./groupTabNotes');
const { getAllGroups } = require('./manager');

function getNoteSummary(groupId) {
  const groupNotes = getNotesForGroup(groupId);
  const tabIds = Object.keys(groupNotes);
  return {
    groupId,
    noteCount: tabIds.length,
    tabIds
  };
}

function getGroupsWithNotes() {
  const groups = getAllGroups();
  return groups
    .filter(g => getNoteCount(g.id) > 0)
    .map(g => ({
      groupId: g.id,
      name: g.name,
      noteCount: getNoteCount(g.id)
    }));
}

function getMostAnnotatedGroup() {
  const groups = getAllGroups();
  let best = null;
  let bestCount = 0;
  for (const g of groups) {
    const count = getNoteCount(g.id);
    if (count > bestCount) {
      bestCount = count;
      best = { groupId: g.id, name: g.name, noteCount: count };
    }
  }
  return best;
}

function getRecentlyUpdatedNotes(limit = 5) {
  const all = getAllNotes();
  return Object.entries(all)
    .map(([key, note]) => {
      const [groupId, tabId] = key.split('::');
      return { groupId, tabId, ...note };
    })
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}

module.exports = {
  getNoteSummary,
  getGroupsWithNotes,
  getMostAnnotatedGroup,
  getRecentlyUpdatedNotes
};
