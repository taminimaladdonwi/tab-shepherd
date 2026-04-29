// Tracks time spent on tabs within groups
const timeRecords = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function startTracking(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  const existing = timeRecords.get(key) || { totalMs: 0, sessions: [] };
  if (existing.activeStart != null) return; // already tracking
  existing.activeStart = Date.now();
  timeRecords.set(key, existing);
}

function stopTracking(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  const record = timeRecords.get(key);
  if (!record || record.activeStart == null) return;
  const duration = Date.now() - record.activeStart;
  record.totalMs += duration;
  record.sessions.push({ start: record.activeStart, end: Date.now(), durationMs: duration });
  delete record.activeStart;
  timeRecords.set(key, record);
}

function getTimeRecord(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  return timeRecords.get(key) || null;
}

function getTotalTime(groupId, tabId) {
  const record = getTimeRecord(groupId, tabId);
  if (!record) return 0;
  const liveMs = record.activeStart != null ? Date.now() - record.activeStart : 0;
  return record.totalMs + liveMs;
}

function getGroupTimeRecords(groupId) {
  const result = {};
  for (const [key, record] of timeRecords.entries()) {
    const [gId, tabId] = key.split('::');
    if (gId === groupId) {
      result[tabId] = { ...record };
    }
  }
  return result;
}

function getMostTimeSpentTab(groupId) {
  const records = getGroupTimeRecords(groupId);
  let maxTabId = null;
  let maxMs = -1;
  for (const [tabId, record] of Object.entries(records)) {
    const liveMs = record.activeStart != null ? Date.now() - record.activeStart : 0;
    const total = record.totalMs + liveMs;
    if (total > maxMs) {
      maxMs = total;
      maxTabId = tabId;
    }
  }
  return maxTabId ? { tabId: maxTabId, totalMs: maxMs } : null;
}

function clearTimeRecords() {
  timeRecords.clear();
}

module.exports = {
  startTracking,
  stopTracking,
  getTimeRecord,
  getTotalTime,
  getGroupTimeRecords,
  getMostTimeSpentTab,
  clearTimeRecords
};
