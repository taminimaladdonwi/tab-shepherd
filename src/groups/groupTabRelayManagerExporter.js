/**
 * groupTabRelayManagerExporter.js
 * Export and import relay chain data.
 */

const { getRelaysForGroup, setRelay, clearRelays } = require('./groupTabRelayManager');
const { getAllGroups } = require('./manager');

function exportRelays() {
  const groups = getAllGroups();
  const data = {};
  for (const group of groups) {
    const relays = getRelaysForGroup(group.id);
    if (relays.length > 0) {
      data[group.id] = relays.map(r => ({
        relayId: r.relayId,
        tabIds: r.tabIds,
        createdAt: r.createdAt
      }));
    }
  }
  return { version: 1, exportedAt: Date.now(), relays: data };
}

function validateRelayImport(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.version !== 1) return false;
  if (!data.relays || typeof data.relays !== 'object') return false;
  for (const [, relayList] of Object.entries(data.relays)) {
    if (!Array.isArray(relayList)) return false;
    for (const r of relayList) {
      if (!r.relayId || !Array.isArray(r.tabIds) || r.tabIds.length < 2) return false;
    }
  }
  return true;
}

function importRelays(data, { merge = false } = {}) {
  if (!validateRelayImport(data)) throw new Error('Invalid relay import data');
  if (!merge) clearRelays();
  for (const [groupId, relayList] of Object.entries(data.relays)) {
    for (const r of relayList) {
      setRelay(groupId, r.relayId, r.tabIds);
    }
  }
  return true;
}

module.exports = { exportRelays, validateRelayImport, importRelays };
