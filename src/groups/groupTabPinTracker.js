// Tracks which tabs are pinned within groups
const pinnedTabs = new Map();
const pinHistory = [];

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidReason(reason) {
  return typeof reason === 'string' && reason.trim().length > 0;
}

function pinTab(groupId, tabId, reason = 'manual') {
  if (!isValidReason(reason)) throw new Error('Invalid pin reason');
  const key = makeKey(groupId, tabId);
  const entry = { groupId, tabId, reason, pinnedAt: Date.now() };
  pinnedTabs.set(key, entry);
  pinHistory.push({ ...entry, action: 'pin' });
  return entry;
}

function unpinTab(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  if (!pinnedTabs.has(key)) return false;
  const entry = pinnedTabs.get(key);
  pinnedTabs.delete(key);
  pinHistory.push({ ...entry, action: 'unpin', unpinnedAt: Date.now() });
  return true;
}

function isTabPinned(groupId, tabId) {
  return pinnedTabs.has(makeKey(groupId, tabId));
}

function getPinInfo(groupId, tabId) {
  return pinnedTabs.get(makeKey(groupId, tabId)) || null;
}

function getPinnedTabsInGroup(groupId) {
  const result = [];
  for (const [, entry] of pinnedTabs) {
    if (entry.groupId === groupId) result.push(entry);
  }
  return result;
}

function getAllPinnedTabs() {
  return Array.from(pinnedTabs.values());
}

function getPinHistory() {
  return [...pinHistory];
}

function clearPinData() {
  pinnedTabs.clear();
  pinHistory.length = 0;
}

module.exports = {
  isValidReason,
  pinTab,
  unpinTab,
  isTabPinned,
  getPinInfo,
  getPinnedTabsInGroup,
  getAllPinnedTabs,
  getPinHistory,
  clearPinData
};
