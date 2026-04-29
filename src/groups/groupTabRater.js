const ratings = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

function setRating(groupId, tabId, rating, note = '') {
  if (!groupId || !tabId) throw new Error('groupId and tabId are required');
  if (!isValidRating(rating)) throw new Error('Rating must be an integer between 1 and 5');
  const key = makeKey(groupId, tabId);
  ratings.set(key, { groupId, tabId, rating, note, updatedAt: Date.now() });
}

function getRating(groupId, tabId) {
  return ratings.get(makeKey(groupId, tabId)) || null;
}

function removeRating(groupId, tabId) {
  return ratings.delete(makeKey(groupId, tabId));
}

function getRatingsForGroup(groupId) {
  const result = [];
  for (const entry of ratings.values()) {
    if (entry.groupId === groupId) result.push(entry);
  }
  return result;
}

function getAverageRatingForGroup(groupId) {
  const entries = getRatingsForGroup(groupId);
  if (entries.length === 0) return null;
  const sum = entries.reduce((acc, e) => acc + e.rating, 0);
  return parseFloat((sum / entries.length).toFixed(2));
}

function getAllRatings() {
  return Array.from(ratings.values());
}

function clearRatings() {
  ratings.clear();
}

module.exports = {
  isValidRating,
  setRating,
  getRating,
  removeRating,
  getRatingsForGroup,
  getAverageRatingForGroup,
  getAllRatings,
  clearRatings
};
