const { getAllRatings, setRating, clearRatings, isValidRating } = require('./groupTabRater');

function exportRatings() {
  return JSON.stringify(getAllRatings());
}

function validateRatingImport(data) {
  if (!Array.isArray(data)) return false;
  return data.every(
    e =>
      typeof e.groupId === 'string' &&
      typeof e.tabId === 'string' &&
      isValidRating(e.rating)
  );
}

function importRatings(json, { merge = false } = {}) {
  let data;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON for ratings import');
  }
  if (!validateRatingImport(data)) {
    throw new Error('Invalid ratings import format');
  }
  if (!merge) clearRatings();
  for (const entry of data) {
    setRating(entry.groupId, entry.tabId, entry.rating, entry.note || '');
  }
  return data.length;
}

module.exports = { exportRatings, validateRatingImport, importRatings };
