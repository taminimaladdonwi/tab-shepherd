// groupFavoritesView.js — read-only views over favorite groups

const { getAllFavorites, getFavoritesSortedByDate, isFavorite } = require('./groupFavorites');
const { getAllGroups } = require('./manager');

function getFavoriteSummary() {
  const all = getAllFavorites();
  const ids = Object.keys(all);
  return {
    total: ids.length,
    groupIds: ids
  };
}

function getFavoriteGroupDetails() {
  const groups = getAllGroups();
  const sorted = getFavoritesSortedByDate();
  return sorted.map(({ groupId, addedAt, note }) => {
    const group = groups[groupId] || null;
    return {
      groupId,
      groupName: group ? group.name : null,
      tabCount: group ? (group.tabs || []).length : 0,
      addedAt,
      note
    };
  });
}

function getNonFavoriteGroups() {
  const groups = getAllGroups();
  return Object.entries(groups)
    .filter(([id]) => !isFavorite(id))
    .map(([id, group]) => ({ groupId: id, ...group }));
}

module.exports = {
  getFavoriteSummary,
  getFavoriteGroupDetails,
  getNonFavoriteGroups
};
