const { getGroupTimeRecords, clearTimeRecords } = require('./groupTabTimeTracker');
const { getAllGroups } = require('./manager');

function exportTimeData() {
  const groups = getAllGroups();
  const data = {};
  for (const group of groups) {
    const records = getGroupTimeRecords(group.id);
    if (Object.keys(records).length > 0) {
      data[group.id] = records;
    }
  }
  return { version: 1, exportedAt: Date.now(), data };
}

function validateTimeImport(parsed) {
  if (!parsed || typeof parsed !== 'object') return false;
  if (parsed.version !== 1) return false;
  if (!parsed.data || typeof parsed.data !== 'object') return false;
  for (const [groupId, records] of Object.entries(parsed.data)) {
    if (typeof groupId !== 'string') return false;
    for (const [tabId, record] of Object.entries(records)) {
      if (typeof tabId !== 'string') return false;
      if (typeof record.totalMs !== 'number') return false;
      if (!Array.isArray(record.sessions)) return false;
    }
  }
  return true;
}

function importTimeData(payload, { merge = false } = {}) {
  let parsed;
  try {
    parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
  } catch {
    return { success: false, error: 'Invalid JSON' };
  }
  if (!validateTimeImport(parsed)) {
    return { success: false, error: 'Invalid format' };
  }
  if (!merge) clearTimeRecords();
  const { startTracking, stopTracking } = require('./groupTabTimeTracker');
  // Re-hydrate records by directly importing via internal map workaround
  const tracker = require('./groupTabTimeTracker');
  for (const [groupId, records] of Object.entries(parsed.data)) {
    for (const [tabId, record] of Object.entries(records)) {
      // Seed total time by starting/stopping a zero-duration session trick
      // We expose clearTimeRecords and re-import via the module internals
      const key = `${groupId}::${tabId}`;
      tracker._importRecord && tracker._importRecord(key, record);
    }
  }
  return { success: true, groupCount: Object.keys(parsed.data).length };
}

module.exports = { exportTimeData, validateTimeImport, importTimeData };
