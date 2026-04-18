// sessionSnapshotExporter.js — serializes and deserializes session snapshots for import/export

const { saveSnapshot, getAllSnapshots } = require('./sessionSnapshot');

/**
 * Exports all current snapshots as a JSON string.
 * @returns {string}
 */
function exportSnapshots() {
  const data = getAllSnapshots();
  return JSON.stringify({ version: 1, exportedAt: Date.now(), snapshots: data });
}

/**
 * Imports snapshots from a JSON string, merging into current store.
 * @param {string} jsonString
 * @param {object} options
 * @param {boolean} [options.overwrite=false] - overwrite existing sessions
 * @returns {{ imported: number, skipped: number }}
 */
function importSnapshots(jsonString, { overwrite = false } = {}) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON for snapshot import');
  }

  if (!parsed.snapshots || !Array.isArray(parsed.snapshots)) {
    throw new Error('Snapshot data missing or malformed');
  }

  let imported = 0;
  let skipped = 0;

  for (const snap of parsed.snapshots) {
    if (!snap.sessionId || !Array.isArray(snap.tabs)) {
      skipped++;
      continue;
    }
    const { getAllSnapshots: _get } = require('./sessionSnapshot');
    const existing = require('./sessionSnapshot').getSnapshot(snap.sessionId);
    if (existing && !overwrite) {
      skipped++;
      continue;
    }
    saveSnapshot(snap.sessionId, snap.tabs);
    imported++;
  }

  return { imported, skipped };
}

module.exports = { exportSnapshots, importSnapshots };
