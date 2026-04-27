/**
 * groupTabPrioritizer.js
 * Assigns and manages priority levels for tabs within groups.
 * Priority levels: 'critical', 'high', 'normal', 'low'
 */

const VALID_PRIORITIES = ['critical', 'high', 'normal', 'low'];
const priorities = new Map(); // key: `${groupId}:${tabId}`

function makeKey(groupId, tabId) {
  return `${groupId}:${tabId}`;
}

function isValidPriority(priority) {
  return VALID_PRIORITIES.includes(priority);
}

function setPriority(groupId, tabId, priority) {
  if (!isValidPriority(priority)) {
    throw new Error(`Invalid priority: ${priority}. Must be one of ${VALID_PRIORITIES.join(', ')}`);
  }
  const key = makeKey(groupId, tabId);
  priorities.set(key, { groupId, tabId, priority, setAt: Date.now() });
}

function getPriority(groupId, tabId) {
  return priorities.get(makeKey(groupId, tabId)) || null;
}

function removePriority(groupId, tabId) {
  return priorities.delete(makeKey(groupId, tabId));
}

function getGroupPriorities(groupId) {
  const result = [];
  for (const [, entry] of priorities) {
    if (entry.groupId === groupId) result.push(entry);
  }
  return result;
}

function getTabsByPriority(groupId, priority) {
  if (!isValidPriority(priority)) throw new Error(`Invalid priority: ${priority}`);
  return getGroupPriorities(groupId).filter(e => e.priority === priority);
}

function getSortedTabs(groupId, tabs) {
  const order = { critical: 0, high: 1, normal: 2, low: 3 };
  return [...tabs].sort((a, b) => {
    const pa = getPriority(groupId, a.id);
    const pb = getPriority(groupId, b.id);
    const oa = pa ? order[pa.priority] : 2;
    const ob = pb ? order[pb.priority] : 2;
    return oa - ob;
  });
}

function clearGroupPriorities(groupId) {
  for (const key of [...priorities.keys()]) {
    if (key.startsWith(`${groupId}:`)) priorities.delete(key);
  }
}

function clearAll() {
  priorities.clear();
}

function getValidPriorities() {
  return [...VALID_PRIORITIES];
}

module.exports = {
  isValidPriority,
  setPriority,
  getPriority,
  removePriority,
  getGroupPriorities,
  getTabsByPriority,
  getSortedTabs,
  clearGroupPriorities,
  clearAll,
  getValidPriorities
};
