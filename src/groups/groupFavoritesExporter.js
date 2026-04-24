// groupFavoritesExporter.js — export and import favorites list

const { getAllFavorites, addFavorite, clearFavorites, isFavorite } = require('./groupFavorites');

const EXPORT_VERSION = 1;

function exportFavorites() {
  const favorites = getAllFavorites();
  return JSON.stringify({
    version: EXPORT_VERSION,
    exportedAt: Date.now(),
    favorites
  });
}

function importFavorites(jsonString, { merge = false } = {}) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON for favorites import');
  }

  if (!parsed.favorites || typeof parsed.favorites !== 'object') {
    throw new Error('Missing or invalid favorites data');
  }

  if (!merge) {
    clearFavorites();
  }

  const imported = [];
  const skipped = [];

  for (const [groupId, data] of Object.entries(parsed.favorites)) {
    if (merge && isFavorite(groupId)) {
      skipped.push(groupId);
      continue;
    }
    addFavorite(groupId, data.note || '');
    imported.push(groupId);
  }

  return { imported, skipped };
}

module.exports = { exportFavorites, importFavorites };
