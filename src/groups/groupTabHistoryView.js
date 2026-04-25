const {
  getTabHistory,
  getTabHistoryByAction,
  getRecentEvents
} = require('./groupTabHistory');

function getHistorySummary(groupId) {
  const entries = getTabHistory(groupId);
  const summary = { total: entries.length, byAction: {} };

  for (const entry of entries) {
    summary.byAction[entry.action] = (summary.byAction[entry.action] || 0) + 1;
  }

  return summary;
}

function getClosedTabUrls(groupId) {
  return getTabHistoryByAction(groupId, 'closed').map(e => e.url).filter(Boolean);
}

function getRecentTabTitles(groupId, limit = 5) {
  return getRecentEvents(groupId, limit).map(e => ({
    title: e.title || '(no title)',
    action: e.action,
    timestamp: e.timestamp
  }));
}

module.exports = {
  getHistorySummary,
  getClosedTabUrls,
  getRecentTabTitles
};
