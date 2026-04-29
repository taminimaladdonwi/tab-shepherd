// groupTabFlagManager.js
// Manages boolean flags (e.g. 'important', 'review', 'ignore') on tabs within groups

const flags = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

const VALID_FLAGS = new Set(['important', 'review', 'ignore', 'pinned', 'archived']);

function isValidFlag(flag) {
  return typeof flag === 'string' && VALID_FLAGS.has(flag);
}

function setFlag(groupId, tabId, flag) {
  if (!isValidFlag(flag)) throw new Error(`Invalid flag: ${flag}`);
  const key = makeKey(groupId, tabId);
  if (!flags.has(key)) flags.set(key, new Set());
  flags.get(key).add(flag);
}

function unsetFlag(groupId, tabId, flag) {
  if (!isValidFlag(flag)) throw new Error(`Invalid flag: ${flag}`);
  const key = makeKey(groupId, tabId);
  if (!flags.has(key)) return;
  flags.get(key).delete(flag);
  if (flags.get(key).size === 0) flags.delete(key);
}

function hasFlag(groupId, tabId, flag) {
  const key = makeKey(groupId, tabId);
  return flags.has(key) && flags.get(key).has(flag);
}

function getFlags(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  return flags.has(key) ? Array.from(flags.get(key)) : [];
}

function getTabsWithFlag(groupId, tabs, flag) {
  return tabs.filter(tab => hasFlag(groupId, tab.id, flag));
}

function getFlaggedTabsInGroup(groupId, tabs) {
  return tabs.filter(tab => getFlags(groupId, tab.id).length > 0);
}

function clearFlags(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  flags.delete(key);
}

function clearAll() {
  flags.clear();
}

function getSupportedFlags() {
  return Array.from(VALID_FLAGS);
}

module.exports = {
  isValidFlag,
  setFlag,
  unsetFlag,
  hasFlag,
  getFlags,
  getTabsWithFlag,
  getFlaggedTabsInGroup,
  clearFlags,
  clearAll,
  getSupportedFlags
};
