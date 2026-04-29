/**
 * groupTabRelayManager.js
 * Manages relay chains between tabs — ordered sequences of tabs
 * that should be visited/activated in succession.
 */

const relays = new Map();
const relayHistory = [];

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidRelay(relay) {
  return Array.isArray(relay) && relay.length >= 2 &&
    relay.every(id => typeof id === 'string' || typeof id === 'number');
}

function setRelay(groupId, relayId, tabIds) {
  if (!isValidRelay(tabIds)) throw new Error('Relay must be an array of at least 2 tab IDs');
  const key = makeKey(groupId, relayId);
  relays.set(key, { groupId, relayId, tabIds: [...tabIds], createdAt: Date.now() });
}

function getRelay(groupId, relayId) {
  return relays.get(makeKey(groupId, relayId)) || null;
}

function removeRelay(groupId, relayId) {
  return relays.delete(makeKey(groupId, relayId));
}

function getRelaysForGroup(groupId) {
  const result = [];
  for (const [, relay] of relays) {
    if (relay.groupId === groupId) result.push(relay);
  }
  return result;
}

function advanceRelay(groupId, relayId) {
  const relay = getRelay(groupId, relayId);
  if (!relay) return null;
  const [current, ...rest] = relay.tabIds;
  relayHistory.push({ groupId, relayId, activatedTabId: current, at: Date.now() });
  if (rest.length === 0) {
    removeRelay(groupId, relayId);
    return { done: true, activatedTabId: current };
  }
  relays.set(makeKey(groupId, relayId), { ...relay, tabIds: rest });
  return { done: false, activatedTabId: current, remaining: rest };
}

function getRelayHistory() {
  return [...relayHistory];
}

function clearRelays() {
  relays.clear();
  relayHistory.length = 0;
}

module.exports = {
  isValidRelay,
  setRelay,
  getRelay,
  removeRelay,
  getRelaysForGroup,
  advanceRelay,
  getRelayHistory,
  clearRelays
};
