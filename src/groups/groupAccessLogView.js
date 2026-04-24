/**
 * groupAccessLogView.js
 * Provides read-only views and summaries over the group access log.
 */

const {
  getAllAccessLogs,
  getAccessLog,
  getAccessCount,
} = require('./groupAccessLog');

function getMostAccessedGroup() {
  const logs = getAllAccessLogs();
  let topGroup = null;
  let topCount = 0;

  for (const [groupId, entries] of Object.entries(logs)) {
    if (entries.length > topCount) {
      topCount = entries.length;
      topGroup = groupId;
    }
  }

  return topGroup ? { groupId: topGroup, count: topCount } : null;
}

function getAccessSummary() {
  const logs = getAllAccessLogs();
  const summary = {};

  for (const [groupId, entries] of Object.entries(logs)) {
    const actionCounts = {};
    for (const entry of entries) {
      actionCounts[entry.action] = (actionCounts[entry.action] ?? 0) + 1;
    }
    summary[groupId] = {
      total: entries.length,
      byAction: actionCounts,
      lastAccess: entries.length > 0 ? entries[entries.length - 1].timestamp : null,
    };
  }

  return summary;
}

function getRecentlyAccessedGroups(limit = 5) {
  const logs = getAllAccessLogs();
  const lastAccesses = [];

  for (const [groupId, entries] of Object.entries(logs)) {
    if (entries.length > 0) {
      const last = entries[entries.length - 1];
      lastAccesses.push({ groupId, timestamp: last.timestamp, action: last.action });
    }
  }

  return lastAccesses
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

module.exports = {
  getMostAccessedGroup,
  getAccessSummary,
  getRecentlyAccessedGroups,
};
