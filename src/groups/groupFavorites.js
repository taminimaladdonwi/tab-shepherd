// groupFavorites.js — mark and manage favorite groups

const favorites = new Map(); // groupId -> { addedAt, note }

function addFavorite(groupId, note = '') {
  if (!groupId) throw new Error('groupId is required');
  if (favorites.has(groupId)) return false;
  favorites.set(groupId, { addedAt: Date.now(), note });
  return true;
}

function removeFavorite(groupId) {
  return favorites.delete(groupId);
}

function isFavorite(groupId) {
  return favorites.has(groupId);
}

function getFavorite(groupId) {
  return favorites.get(groupId) || null;
}

function getAllFavorites() {
  const result = {};
  for (const [id, data] of favorites.entries()) {
    result[id] = { ...data };
  }
  return result;
}

function updateNote(groupId, note) {
  if (!favorites.has(groupId)) return false;
  const entry = favorites.get(groupId);
  favorites.set(groupId, { ...entry, note });
  return true;
}

function getFavoritesSortedByDate() {
  return [...favorites.entries()]
    .sort((a, b) => a[1].addedAt - b[1].addedAt)
    .map(([id, data]) => ({ groupId: id, ...data }));
}

function clearFavorites() {
  favorites.clear();
}

module.exports = {
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavorite,
  getAllFavorites,
  updateNote,
  getFavoritesSortedByDate,
  clearFavorites
};
