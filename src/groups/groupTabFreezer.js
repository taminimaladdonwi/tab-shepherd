/**
 * groupTabFreezer.js
 * Tracks and manages "frozen" tabs within groups — tabs that are exempt
 * from automatic suspension regardless of inactivity rules.
 */

const frozen = new Map(); // key: `${groupId}:${tabId}` => { frozenAt, reason }

function makeKey(groupId, tabId) {
  return `${groupId}:${tabId}`;
}

function isValidReason(reason) {
  return typeof reason === 'string' && reason.trim().length > 0;
}

function freezeTab(groupId, tabId, reason = 'manual') {
  if (!isValidReason(reason)) throw new Error('Invalid freeze reason');
  const key = makeKey(groupId, tabId);
  frozen.set(key, { groupId, tabId, reason, frozenAt: Date.now() });
}

function unfreezeTab(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  return frozen.delete(key);
}

function isFrozen(groupId, tabId) {
  return frozen.has(makeKey(groupId, tabId));
}

function getFreezeInfo(groupId, tabId) {
  return frozen.get(makeKey(groupId, tabId)) || null;
}

function getFrozenTabsInGroup(groupId) {
  const result = [];
  for (const [, info] of frozen) {
    if (info.groupId === groupId) result.push(info);
  }
  return result;
}

function getAllFrozen() {
  return Array.from(frozen.values());
}

function filterSuspendable(groupId, tabs) {
  return tabs.filter(tab => !isFrozen(groupId, tab.id));
}

function clearFrozen() {
  frozen.clear();
}

module.exports = {
  freezeTab,
  unfreezeTab,
  isFrozen,
  getFreezeInfo,
  getFrozenTabsInGroup,
  getAllFrozen,
  filterSuspendable,
  clearFrozen
};
