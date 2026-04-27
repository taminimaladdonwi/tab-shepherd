/**
 * groupTabPrioritizerView.js
 * Read-only views and summaries over tab priority data.
 */

const { getGroupPriorities, getValidPriorities } = require('./groupTabPrioritizer');

function getPrioritySummary(groupId) {
  const entries = getGroupPriorities(groupId);
  const summary = {};
  for (const p of getValidPriorities()) summary[p] = 0;
  for (const { priority } of entries) {
    summary[priority] = (summary[priority] || 0) + 1;
  }
  return { groupId, total: entries.length, breakdown: summary };
}

function getHighPriorityTabs(groupId) {
  return getGroupPriorities(groupId)
    .filter(e => e.priority === 'critical' || e.priority === 'high')
    .map(e => e.tabId);
}

function getLowPriorityTabs(groupId) {
  return getGroupPriorities(groupId)
    .filter(e => e.priority === 'low')
    .map(e => e.tabId);
}

function getUnprioritizedTabs(groupId, allTabIds) {
  const prioritized = new Set(getGroupPriorities(groupId).map(e => e.tabId));
  return allTabIds.filter(id => !prioritized.has(id));
}

module.exports = {
  getPrioritySummary,
  getHighPriorityTabs,
  getLowPriorityTabs,
  getUnprioritizedTabs
};
