/**
 * groupTabStatusTracker.js
 * Tracks the status (active, suspended, frozen, loading) of tabs within groups.
 */

const statusMap = new Map();

const VALID_STATUSES = ['active', 'suspended', 'frozen', 'loading', 'discarded'];

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

function setStatus(groupId, tabId, status) {
  if (!isValidStatus(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  const key = makeKey(groupId, tabId);
  const previous = statusMap.get(key) || null;
  statusMap.set(key, { status, updatedAt: Date.now(), previous });
}

function getStatus(groupId, tabId) {
  return statusMap.get(makeKey(groupId, tabId)) || null;
}

function removeStatus(groupId, tabId) {
  return statusMap.delete(makeKey(groupId, tabId));
}

function getStatusesForGroup(groupId) {
  const results = {};
  for (const [key, value] of statusMap.entries()) {
    const [gId, tId] = key.split('::');
    if (gId === String(groupId)) {
      results[tId] = value;
    }
  }
  return results;
}

function getTabsByStatus(groupId, status) {
  const tabIds = [];
  for (const [key, value] of statusMap.entries()) {
    const [gId, tId] = key.split('::');
    if (gId === String(groupId) && value.status === status) {
      tabIds.push(tId);
    }
  }
  return tabIds;
}

function getStatusCounts(groupId) {
  const counts = Object.fromEntries(VALID_STATUSES.map(s => [s, 0]));
  for (const [key, value] of statusMap.entries()) {
    const [gId] = key.split('::');
    if (gId === String(groupId)) {
      counts[value.status] = (counts[value.status] || 0) + 1;
    }
  }
  return counts;
}

function clearStatuses() {
  statusMap.clear();
}

module.exports = {
  isValidStatus,
  setStatus,
  getStatus,
  removeStatus,
  getStatusesForGroup,
  getTabsByStatus,
  getStatusCounts,
  clearStatuses,
  VALID_STATUSES
};
