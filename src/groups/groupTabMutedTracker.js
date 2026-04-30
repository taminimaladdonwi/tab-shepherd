const muteRecords = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidReason(reason) {
  return typeof reason === 'string' && reason.trim().length > 0;
}

function muteTab(groupId, tabId, reason = 'manual') {
  if (!isValidReason(reason)) throw new Error('Invalid mute reason');
  const key = makeKey(groupId, tabId);
  muteRecords.set(key, {
    groupId,
    tabId,
    reason,
    mutedAt: Date.now()
  });
}

function unmuteTab(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  muteRecords.delete(key);
}

function isMuted(groupId, tabId) {
  return muteRecords.has(makeKey(groupId, tabId));
}

function getMuteRecord(groupId, tabId) {
  return muteRecords.get(makeKey(groupId, tabId)) || null;
}

function getMutedTabsInGroup(groupId) {
  const result = [];
  for (const record of muteRecords.values()) {
    if (record.groupId === groupId) result.push(record);
  }
  return result;
}

function getAllMuted() {
  return Array.from(muteRecords.values());
}

function getMuteReasonDistribution() {
  const dist = {};
  for (const record of muteRecords.values()) {
    dist[record.reason] = (dist[record.reason] || 0) + 1;
  }
  return dist;
}

function clearMuteRecords() {
  muteRecords.clear();
}

module.exports = {
  makeKey,
  isValidReason,
  muteTab,
  unmuteTab,
  isMuted,
  getMuteRecord,
  getMutedTabsInGroup,
  getAllMuted,
  getMuteReasonDistribution,
  clearMuteRecords
};
