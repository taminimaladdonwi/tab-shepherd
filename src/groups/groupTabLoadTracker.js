// Tracks load state of tabs within groups (loading, complete, error)

const loadStates = new Map();
const VALID_STATES = ['loading', 'complete', 'error', 'unloaded'];

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidState(state) {
  return VALID_STATES.includes(state);
}

function setLoadState(groupId, tabId, state, meta = {}) {
  if (!isValidState(state)) throw new Error(`Invalid load state: ${state}`);
  const key = makeKey(groupId, tabId);
  loadStates.set(key, { groupId, tabId, state, updatedAt: Date.now(), ...meta });
}

function getLoadState(groupId, tabId) {
  return loadStates.get(makeKey(groupId, tabId)) || null;
}

function removeLoadState(groupId, tabId) {
  return loadStates.delete(makeKey(groupId, tabId));
}

function getGroupLoadStates(groupId) {
  const results = [];
  for (const [, record] of loadStates) {
    if (record.groupId === groupId) results.push(record);
  }
  return results;
}

function getTabsByState(groupId, state) {
  return getGroupLoadStates(groupId).filter(r => r.state === state);
}

function getLoadSummary(groupId) {
  const records = getGroupLoadStates(groupId);
  const summary = { total: records.length };
  for (const state of VALID_STATES) {
    summary[state] = records.filter(r => r.state === state).length;
  }
  return summary;
}

function getAllLoadStates() {
  return Array.from(loadStates.values());
}

function clearLoadStates() {
  loadStates.clear();
}

module.exports = {
  isValidState,
  setLoadState,
  getLoadState,
  removeLoadState,
  getGroupLoadStates,
  getTabsByState,
  getLoadSummary,
  getAllLoadStates,
  clearLoadStates,
  VALID_STATES,
};
