/**
 * groupAccessLog.js
 * Tracks access (activation/focus) events for groups and their tabs.
 */

const accessLog = new Map(); // groupId -> [{ tabId, timestamp, action }]

const VALID_ACTIONS = ['activated', 'focused', 'restored', 'created'];

function isValidAction(action) {
  return VALID_ACTIONS.includes(action);
}

function recordAccess(groupId, tabId, action = 'activated') {
  if (!groupId) throw new Error('groupId is required');
  if (!isValidAction(action)) throw new Error(`Invalid action: ${action}`);

  const entry = { tabId: tabId ?? null, timestamp: Date.now(), action };

  if (!accessLog.has(groupId)) {
    accessLog.set(groupId, []);
  }

  accessLog.get(groupId).push(entry);
  return entry;
}

function getAccessLog(groupId) {
  return accessLog.get(groupId) ?? [];
}

function getLastAccess(groupId) {
  const log = accessLog.get(groupId);
  if (!log || log.length === 0) return null;
  return log[log.length - 1];
}

function getAccessCount(groupId) {
  return (accessLog.get(groupId) ?? []).length;
}

function getAccessLogByAction(groupId, action) {
  return getAccessLog(groupId).filter(entry => entry.action === action);
}

function clearAccessLog(groupId) {
  if (groupId !== undefined) {
    accessLog.delete(groupId);
  } else {
    accessLog.clear();
  }
}

function getAllAccessLogs() {
  const result = {};
  for (const [groupId, entries] of accessLog.entries()) {
    result[groupId] = entries;
  }
  return result;
}

module.exports = {
  isValidAction,
  recordAccess,
  getAccessLog,
  getLastAccess,
  getAccessCount,
  getAccessLogByAction,
  clearAccessLog,
  getAllAccessLogs,
};
