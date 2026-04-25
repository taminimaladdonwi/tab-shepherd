// Tracks tab open/close history within groups
const history = new Map(); // groupId -> [{tabId, url, title, action, timestamp}]

const VALID_ACTIONS = ['opened', 'closed', 'moved_in', 'moved_out'];

function isValidAction(action) {
  return VALID_ACTIONS.includes(action);
}

function recordTabEvent(groupId, tab, action) {
  if (!groupId || !tab || !isValidAction(action)) return null;
  if (!history.has(groupId)) history.set(groupId, []);

  const entry = {
    tabId: tab.id,
    url: tab.url || '',
    title: tab.title || '',
    action,
    timestamp: Date.now()
  };

  history.get(groupId).push(entry);
  return entry;
}

function getTabHistory(groupId) {
  return history.get(groupId) ? [...history.get(groupId)] : [];
}

function getTabHistoryByAction(groupId, action) {
  if (!isValidAction(action)) return [];
  return getTabHistory(groupId).filter(e => e.action === action);
}

function getRecentEvents(groupId, limit = 10) {
  const entries = getTabHistory(groupId);
  return entries.slice(-limit);
}

function getMostFrequentTab(groupId) {
  const entries = getTabHistory(groupId);
  if (!entries.length) return null;

  const counts = {};
  for (const entry of entries) {
    counts[entry.tabId] = (counts[entry.tabId] || 0) + 1;
  }

  const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const topEntry = entries.filter(e => String(e.tabId) === topId).at(-1);
  return { tabId: Number(topId), count: counts[topId], lastSeen: topEntry };
}

function clearTabHistory(groupId) {
  history.delete(groupId);
}

function clearAll() {
  history.clear();
}

module.exports = {
  isValidAction,
  recordTabEvent,
  getTabHistory,
  getTabHistoryByAction,
  getRecentEvents,
  getMostFrequentTab,
  clearTabHistory,
  clearAll
};
