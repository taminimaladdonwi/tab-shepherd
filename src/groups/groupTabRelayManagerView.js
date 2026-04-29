/**
 * groupTabRelayManagerView.js
 * View helpers for relay chain data.
 */

const { getRelaysForGroup, getRelayHistory } = require('./groupTabRelayManager');
const { getAllGroups } = require('./manager');

function getRelaySummary() {
  const groups = getAllGroups();
  const summary = {};
  for (const group of groups) {
    const relays = getRelaysForGroup(group.id);
    if (relays.length > 0) {
      summary[group.id] = {
        name: group.name,
        relayCount: relays.length,
        totalTabsInRelays: relays.reduce((sum, r) => sum + r.tabIds.length, 0)
      };
    }
  }
  return summary;
}

function getLongestRelay() {
  const groups = getAllGroups();
  let longest = null;
  for (const group of groups) {
    for (const relay of getRelaysForGroup(group.id)) {
      if (!longest || relay.tabIds.length > longest.tabIds.length) {
        longest = relay;
      }
    }
  }
  return longest;
}

function getRecentRelayActivity(limit = 10) {
  const history = getRelayHistory();
  return history.slice(-limit).reverse();
}

module.exports = {
  getRelaySummary,
  getLongestRelay,
  getRecentRelayActivity
};
