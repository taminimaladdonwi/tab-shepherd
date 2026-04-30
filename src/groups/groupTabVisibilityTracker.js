// Tracks visibility state (visible/hidden) of tabs within groups
const visibilityMap = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

const VALID_STATES = ['visible', 'hidden', 'unknown'];

function isValidState(state) {
  return VALID_STATES.includes(state);
}

function setVisibility(groupId, tabId, state, meta = {}) {
  if (!isValidState(state)) {
    throw new Error(`Invalid visibility state: ${state}. Must be one of: ${VALID_STATES.join(', ')}`);
  }
  const key = makeKey(groupId, tabId);
  visibilityMap.set(key, {
    groupId,
    tabId,
    state,
    updatedAt: Date.now(),
    ...meta
  });
}

function getVisibility(groupId, tabId) {
  return visibilityMap.get(makeKey(groupId, tabId)) || null;
}

function removeVisibility(groupId, tabId) {
  return visibilityMap.delete(makeKey(groupId, tabId));
}

function getGroupVisibility(groupId) {
  const results = [];
  for (const [, record] of visibilityMap) {
    if (record.groupId === groupId) {
      results.push(record);
    }
  }
  return results;
}

function getHiddenTabs(groupId) {
  return getGroupVisibility(groupId).filter(r => r.state === 'hidden');
}

function getVisibleTabs(groupId) {
  return getGroupVisibility(groupId).filter(r => r.state === 'visible');
}

function getAllVisibilityRecords() {
  return Array.from(visibilityMap.values());
}

function clearVisibility() {
  visibilityMap.clear();
}

module.exports = {
  isValidState,
  setVisibility,
  getVisibility,
  removeVisibility,
  getGroupVisibility,
  getHiddenTabs,
  getVisibleTabs,
  getAllVisibilityRecords,
  clearVisibility
};
